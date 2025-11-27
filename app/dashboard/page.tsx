"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserAvatar, UserProfile } from "@clerk/nextjs"
import { PlusSquare } from "lucide-react"
import { Dosis } from "next/font/google"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const dosis = Dosis({
    subsets : ["latin"]
})

export default function Dashboard () {



    return (
        <div className="flex flex-col w-full my-2">
            <div className="flex justify-between p-2 rounded-2xl bg-primary-foreground">
                <div className="flex items-center">
                    <SidebarTrigger/>   
                    <h1 className={`${dosis.className} text-2xl font-semibold`}>
                        FrameFlux
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog>
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

                            <form>

                                <div>
                                    <Label>
                                        Image to Edit
                                    </Label>
                                    <div>
                                        // input
                                    </div>
                                </div>

                            </form>
                            
                        </DialogContent>
                    </Dialog>
                    <UserAvatar/>
                </div>
            </div>
        </div>

    )
}