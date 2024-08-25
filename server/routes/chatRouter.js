import { Router } from "express";
import { saveChat, getUserChats, getChatMessages } from "./../controllers/chatController.js";

const chatRouter = Router();
chatRouter.post('/saveChat', saveChat);
chatRouter.get('/getUserChats/:userId', getUserChats);
chatRouter.get('/getChatMessages/:userId/:chatId', getChatMessages);

export default chatRouter;