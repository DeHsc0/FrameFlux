import { Router } from "express";
import { handleClerkWebhool } from "../controllers/webhook.controller";

const webhookRouter = Router()

webhookRouter.post("/" , handleClerkWebhool)

export default webhookRouter