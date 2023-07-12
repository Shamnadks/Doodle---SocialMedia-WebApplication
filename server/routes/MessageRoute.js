import express from 'express'
import { addMessage, getMessage, getUnreadCount } from '../controllers/MessageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router()

router.post("/", addMessage);

router.get("/unread/:conversationId",verifyToken,getUnreadCount)

router.get("/:conversationId", getMessage);

export default router
