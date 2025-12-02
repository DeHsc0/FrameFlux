"use client"

import axios from "axios"
import { useEffect, useState } from "react"

interface Projects {imageUrl : string , name : string}

export default function ProjectsGrid() {

    const [projects , setProjects] = useState<Projects[]>([])

    const fetchProjects = async () => {

        const response = await axios.get("/api/project")

        if(response.status !== 200)return // toast

        const data = response.data as Projects[]

        console.log(data)

        setProjects(() => [ ...projects , ...data])

    }

    useEffect(() => {
        fetchProjects()
    } , [])

    return   (
        <div className="grid grid-cols-3 gap-6">
            { projects.length > 0 ? projects.map((el , key) => {
                return (
                    <div key={key} className="bg-muted rounded-xl flex flex-col gap-3 pb-4 border-2 hover:border-white/55">
                        <div  style={{ backgroundImage: "url('/frame.jpg')" }} className="max-h-[200px] w-full overflow-hidden flex items-center justify-center rounded-lg bg-center bg-no-repeat bg-cover">
                            <img className="object-contain" src={el.imageUrl} alt="" />
                        </div>
                        <div className="px-3">
                            <h1 className="text-xl">
                                {el.name}                         
                            </h1>
                        </div>
                    </div>
                )
            }) : undefined}
        </div>
    )
        
}