import { Router } from "express"
import webhookRouter from "./webhook.route"

const apiRouter = Router()

apiRouter.use("/webhook" , webhookRouter)

export default apiRouter