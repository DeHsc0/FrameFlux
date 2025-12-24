import { WebhookEvent } from "@clerk/express";
import express ,  { Request, Response } from "express";
import { Webhook } from "svix";
import prisma from "@repo/database/src/index"

export async function handleClerkWebhool (req : Request, res : Response) {

    express.raw( { type : "application/json"} )

    if(!process.env.CLERK_SIGNING_SECRET){
        
        return res.json({
            sucess : false,
            error : "Webhook secret not configured"
        }).status(500)

    }

    const svixId = req.header("svix-id")

    const svixTimestamp = req.header("svix-timestamp")

    const svixSignature = req.header("svix-signature")

    if (!svixId || !svixSignature || !svixTimestamp) {
        return res.json({ 
            error: "Missing required Svix headers" 
        }).status(400)
    }

    const payload = await req.body

    const body = JSON.stringify(payload)

    const wh = new Webhook(process.env.CLERK_SIGNING_SECRET)

    let evt : WebhookEvent

    try{

        evt = wh.verify(body, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent
        
    } catch (err) {

        return res.json({
            success : false,
            error : "Invalid webhool signature"
        }).status(401)

    }

    const evtType = evt.type
   
    if( evtType === "user.created" && evt.data){

        try{

            const { email_addresses , username , id } = evt.data

            if(username === null)return res.json({
                success : false,
                error : "Please provide a username"
            }).status(400)

            if(!email_addresses[0])return res.json({
                success : false,
                error : "Please provide an email address"
            })

            const response = await prisma.user.create({
                data : {
                    email : email_addresses[0].email_address,
                    userName : username,
                    clerkId : id,
                }
            })

            return res.json({
                success : true,
                message : "User created successfully"
            }).status(201)
 
        }
        catch(err){

            return res.json({
                success : false,
                error : "Failed to create user"
            }).status(500)
        }


    } else if( evtType === "user.deleted" && evt.data){

        const { id } = evt.data

        if(!id)return res.json({
            success : false,
            error : "Missing Id"
        }).status(500)

        await prisma.user.delete({
            where : {
                clerkId : id
            }
        })

        return res.json({
            success : false,
            message : "User Deleted Successfully"
        }).status(200)

    } else if ( evtType === "user.updated"){

        const { id , email_addresses , username  } = evt.data

        if(!email_addresses[0])return
        
        if(username === null)return 

        const emailAddress = email_addresses[0].email_address


        await prisma.user.update({
            where : {
                id
            },
            data : {
                email : emailAddress,
                userName : username
            }
        })

        return res.json({
            success : true,
            message : "User Updated Successfully"
        }).status(200)


    } 

}