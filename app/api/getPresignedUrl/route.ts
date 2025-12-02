import { s3 } from '@/lib/utils';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { PreSignedUrlSchema } from './schema';

export async function POST ( req : NextRequest ) {

    try{
      if (!req.headers.get("content-type")?.includes("json"))return NextResponse.json({
        message : "Invalid content type. Expected application/json." 
      } , { status : 415})
      
      const data = await req.json();

      const parsedData = PreSignedUrlSchema.safeParse(data)

      if(!parsedData.success)return new NextResponse(JSON.stringify({
        error : parsedData.error
      }) , { status : 400})

      const {imageType , projectName}= parsedData.data

      if (!imageType.startsWith("image/")) {
        return Response.json({ error: "Only images allowed" }, { status: 400 });
      }

      const fileKey = `uploads/${crypto.randomUUID()}-${projectName}`

      const command = new PutObjectCommand({
        Bucket : process.env.AWS_BUCKET,  //env
        Key : fileKey,
        ContentType : imageType
      })

      const presignedUrl = await getSignedUrl( s3 , command , { expiresIn : 300})

      return new NextResponse(JSON.stringify({
        presignedUrl,
        fileKey
      }) , {status : 200})

    }
    catch(e){
      return new NextResponse( JSON.stringify({
        e
      }) , {status : 400})
    }

}
