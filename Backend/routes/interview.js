import express from "express";
import { handleChat, handleChatSSE } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", handleChat);
router.get("/chat/stream", handleChatSSE);

export default router;
