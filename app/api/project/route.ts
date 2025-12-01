
import { prisma } from '@/lib/db';
import { createProjectSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';



export async function POST ( req : NextRequest ) : Promise<NextResponse> {

    try{
      if (!req.headers.get("content-type")?.includes("application/json"))return NextResponse.json({
        message : "Invalid content type. Expected application/json." 
      } , { status : 415})

      const data = await req.json()

      const parsedData = createProjectSchema.safeParse(data)

      if(!parsedData.success)return NextResponse.json({
        success : false,
        data,
        error : parsedData.error.flatten()
      } , { status : 400 } )

      const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${parsedData.data.key}` 

      const { projectName , clerkId } = parsedData.data

      const user = await prisma.user.findUnique({
        where : {
            clerkId
        }
      })

      if(!user)return NextResponse.json({
        success: false, 
        error: "User does not exist" 
      } , { status : 404 })

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

      return NextResponse.json(data , { status : 200})
    }
    catch(e){
      return NextResponse.json({
        error : e
      } , {status : 400})
    }

}
