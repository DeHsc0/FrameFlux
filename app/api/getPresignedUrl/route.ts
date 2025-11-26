import { s3 } from '@/lib/utils';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

export async function POST ( req : NextRequest ) {

    try{
      if (!req.headers.get("content-type")?.includes("form-data"))return NextResponse.json({
        message : "Invalid content type. Expected multipart/form-data." 
      } , { status : 415})

      const data = await req.formData();

      const image = data.get("image") as File

      if (!image.type.startsWith("image/")) {
        return Response.json({ error: "Only images allowed" }, { status: 400 });
      }

      const fileKey = `uploads/${crypto.randomUUID()}`

      const command = new PutObjectCommand({
        Bucket : process.env.S3_BUCKET,
        Key : fileKey,
        ContentType : image.type
      })

      const presignedUrl = await getSignedUrl( s3 , command , { expiresIn : 300})

      return new NextResponse(JSON.stringify({
        presignedUrl
      }) , {status : 200})

    }
    catch(e){
      return new NextResponse( JSON.stringify({
        e
      }) , {status : 400})
    }

}
