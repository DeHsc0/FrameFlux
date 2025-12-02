"use client"

import ProjectDialog from "@/components/ProjectDialog"
import ProjectsGrid from "@/components/ProjectsGrid"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserAvatar} from "@clerk/nextjs"
import { Dosis } from "next/font/google"

const dosis = Dosis({
    subsets : ["latin"]
})

export default function Dashboard () {
    return (
        <div className="flex flex-col w-full my-2 gap-3">
            <div className="flex justify-between p-2 rounded-2xl bg-primary-foreground">
                <div className="flex items-center">
                    <SidebarTrigger/>   
                    <h1 className={`${dosis.className} text-2xl font-semibold`}>
                        FrameFlux
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <ProjectDialog/>
                    <UserAvatar/>
                </div>
            </div>
            <ProjectsGrid/>
        </div>

    )
}