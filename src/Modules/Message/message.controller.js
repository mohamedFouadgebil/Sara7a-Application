import { Router } from "express";
import * as messageServices from "./message.services.js"
import { validation } from "../../Middleware/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";
const router = Router();

router.post("/send-message/:receiverId" , validation(sendMessageSchema) ,messageServices.sendMessage)
router.get("/get-messages" , messageServices.getMessage)
router.get("/get-user-messages" , messageServices.getUserMessages)

export default router;