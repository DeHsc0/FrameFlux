import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Grid, LucideProps, Trash2 } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import { Star } from 'lucide-react';
import { UserAvatar, UserButton, UserProfile } from "@clerk/nextjs";

interface SidebarMenu {
    title : string,
    url : string,
    icon : ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

const menu : SidebarMenu[]  = [
    {
        title : "All Projects",
        url : "/dashboard",
        icon : Grid
    },
    {
        title : "Favourite",
        url : "/dashboard/favourite",
        icon : Star
    },
    {
        title : "Trash",
        url : "/dashboard/trash",
        icon : Trash2
    }
]

export function AppSidebar() {
  return (
    <Sidebar variant={"floating"} collapsible={"icon"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel >Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                 {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>                        
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}