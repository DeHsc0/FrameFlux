
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createProjectSchema } from './schema';
import { auth } from '@clerk/nextjs/server';


export async function GET ( req : NextRequest) {
  
  try{
    const { userId } = await auth()

    if( userId === null)return NextResponse.json( 
      { error: "Forbidden: Missing user ID" },
      { status: 403 }
    )

    const projects = await prisma.project.findMany({
      where : {
        userClerkId : userId
      },
      select : {
        imageUrl : true,
        name : true
      }
    })

    return NextResponse.json(projects , { status : 200})

  }
  catch(e){

    return NextResponse.json({
      e
    } , { status : 500})

  }

}

export async function POST ( req : NextRequest ) : Promise<NextResponse> {

    try{
      if (!req.headers.get("content-type")?.includes("application/json"))return NextResponse.json({
        message : "Invalid content type. Expected application/json." 
      } , { status : 415})
      
      const { userId } = await auth()

    if( userId === null)return NextResponse.json( 
      { error: "Forbidden: Missing user ID" },
      { status: 403 }
    )
      
      const data = await req.json()

      const parsedData = createProjectSchema.safeParse(data)

      if(!parsedData.success)return NextResponse.json({
        success : false,
        data,
        error : parsedData.error.flatten()
      } , { status : 400 } )

      const imageUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${parsedData.data.key}` 

      const { projectName } = parsedData.data

      const user = await prisma.user.findUnique({
        where : {
            clerkId : userId
        }
      })

      if(!user || user === null)return NextResponse.json({
        success: false, 
        error: "User does not exist",
        user 
      } , { status : 400 })

      const project = await prisma.project.create({
        data : {
            imageUrl,
            name : projectName,
            user : {
                connect : {
                    clerkId : userId
                }
            }
        }
      })

      return NextResponse.json(data , { status : 200})
    }
    catch(e){
      return NextResponse.json({
        error : e
      } , {status : 400})
    }

}
