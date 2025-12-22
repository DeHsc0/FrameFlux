import express from "express"
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import apiRouter from "./routes/index.js"

const app = express()

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api" , apiRouter)

app.listen( process.env.PORT )
