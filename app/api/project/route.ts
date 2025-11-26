
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createProjectSchema } from './schema';

export async function POST ( req : NextRequest ) {

    try{
      if (!req.headers.get("content-type")?.includes("application/json"))return NextResponse.json({
        message : "Invalid content type. Expected application/json." 
      } , { status : 415})

      const data = await req.json()

      const parsedData = createProjectSchema.safeParse(data)

      if(!parsedData.success)return new NextResponse( JSON.stringify({
        success : false,
        error : parsedData.error.flatten()
      }) , { status : 400 } )

      const { projectName , imageUrl , clerkId } = parsedData.data

      const user = await prisma.user.findUnique({
        where : {
            clerkId
        }
      })

      if(!user)return new NextResponse( JSON.stringify({
        success: false, 
        error: "User does not exist" 
      }) , { status : 404 })

      const project = await prisma.project.create({
        data : {
            imageUrl,
            name : projectName,
            user : {
                connect : {
                    clerkId
                }
            }
        }
      })

      return new NextResponse( JSON.stringify(data) , { status : 200})

    }
    catch(e){
      return new NextResponse( JSON.stringify({
        error : e
      }) , {status : 400})
    }

}
