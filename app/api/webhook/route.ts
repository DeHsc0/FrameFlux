
import { WebhookEvent } from '@clerk/nextjs/webhooks'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

    if (!WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ 
            error: "Webhook secret not configured" 
        }), { status: 500 })
    }

    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")
     
    if (!svix_id || !svix_signature || !svix_timestamp) {
        return new Response(JSON.stringify({ 
            error: "Missing required Svix headers" 
        }), { status: 400 })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(WEBHOOK_SECRET)
    
    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return new Response(JSON.stringify({ 
            error: "Invalid webhook signature" 
        }), { status: 401 })
    }

    const evtType = evt.type
   
    if( evtType === "user.created" && evt.data){

        try{

            const { email_addresses , username , id } = evt.data

            if(username === null)return new Response( JSON.stringify({
                message : "Please provide a username"
            }) , {status : 400})

            const response = await prisma.user.create({
                data : {
                    email : email_addresses[0].email_address,
                    userName : username,
                    clerkId : id,
                }
            })

            console.log(response)
            
            return new Response(JSON.stringify({ 
                success: "User created successfully" 
            }), { status: 201 })
            
        }
        catch(err){
            console.error("Database error:", err)
                return new Response(JSON.stringify({ 
                    error: "Failed to create user" 
                }), { status: 500 })
        }


    } else if( evtType === "user.deleted" && evt.data){

        const { id } = evt.data

        if(!id)return new Response( JSON.stringify( {
            message : "Missing ID"
        }) , { status : 400 } )

        await prisma.user.delete({
            where : {
                clerkId : id
            }
        })

        return new Response(JSON.stringify({
            message : "User Deleted Succesfully"
        }) , { status : 200})

    } else if ( evtType === "user.updated"){

        const { id , email_addresses , username  } = evt.data

        const emailAddress = email_addresses[0].email_address

        if(username === null)return 

        await prisma.user.update({
            where : {
                id
            },
            data : {
                email : emailAddress,
                userName : username
            }
        })

        return new Response( JSON.stringify({
            message : "User Updated Successfuly"
        }) , {status : 200})


    } 

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}