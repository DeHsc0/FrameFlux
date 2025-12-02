
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { FileDown, PlusSquare } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import { ProjectCreationFormSchema } from "@/lib/zod"
import z from "zod"
import { useUser } from "@clerk/nextjs"
import axios from "axios"


export default function ProjectDialog () {

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [ loading , setLoading] = useState<boolean>()

    const [ open , setOpen ] = useState<boolean>(false)

    const { user } = useUser()

    const [ userId , setUserId ] = useState<string | undefined>()

    useEffect(() => {

        if(!user)return

        setUserId(user.id)

    } , [user])
    
    type ProjectCreationData = z.infer<typeof ProjectCreationFormSchema>

    const { register , handleSubmit , reset , formState : {errors} , setValue} = useForm<ProjectCreationData>({resolver : zodResolver(ProjectCreationFormSchema)})

    const [imageToEdit , setImageToEdit] = useState< {
        url : string,
        file : File
    } | undefined>()

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files

        if(file === null)return

        const imageUrl = URL.createObjectURL(file[0])    

        setValue( "image" , file[0] , { shouldValidate : true})

        setImageToEdit({ url : imageUrl , file : file[0] })        


    }

    const onSubmit = async (data : ProjectCreationData) => {

        setLoading(true)

        if(!userId){
            setLoading(false)
            setOpen(false)
            //toast User dosent exist
            return 
        }

        if(!imageToEdit)return //toast
        
        const response = await axios.post("/api/getPresignedUrl" , { projectName : data.projectName , imageType : data.image.type} )

        if(response.status !== 200)return console.error(response.data)

        const { presignedUrl , fileKey } = response.data as { presignedUrl : string , fileKey : string }

        const imageToEditUrl = await axios.put(presignedUrl ,imageToEdit.file , {
            headers : {
                "Content-Type" : imageToEdit.file.type
            }
        })

        if(imageToEditUrl.status !== 200){            

            setLoading(false)
            setOpen(false)
            //toast User dosent exist
            return 

        }

        const createProject = await axios.post("/api/project" , {
            projectName : data.projectName,
            key : fileKey
        })

        console.log(createProject)

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"default"} size={"lg"}>
                    <PlusSquare/>
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a New Project
                    </DialogTitle>
                    <DialogDescription>
                        Add a name and image to start editing
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit, (e) => console.error(e))}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label className="">
                                Image to edit
                            </Label>
                            { imageToEdit ?(
                                    <div className="w-full flex justify-center mt-2">
                                        <div   style={{ backgroundImage: "url('/frame.jpg')" }} className="max-h-[380px] w-full overflow-hidden flex items-center justify-center rounded-lg bg-center bg-no-repeat bg-cover">
                                        <img
                                            src={imageToEdit.url}
                                            alt=""
                                            className="w-full h-full object-contain"
                                        />
                                        </div>
                                    </div>
                                    ) : <div onClick={(e) => inputRef.current?.click()}  className="flex flex-col gap-4 items-center bg-primary-foreground border-2 border-dashed rounded-xl px-4 py-12">
                                <FileDown size={72}/> 
                                <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleFileChange} />
                                <p className="">
                                    Click to Upload or <span className="font-semibold">drag and drop</span>
                                </p>
                            </div> }
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="projectName">
                                Project Name
                            </Label>
                            <Input id="projectName" {...register("projectName")} type="text" placeholder="e.g., Profile Pic Edit"/>
                        </div>
                        <div className="flex justify-between">
                            <Button variant={"destructive"}>Cancel</Button>
                            <Button type="submit">Create a project</Button>
                        </div>
                    </div>
                </form>
                
            </DialogContent>
        </Dialog>
    )


}