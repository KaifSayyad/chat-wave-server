import { Router } from "express";
import { saveChat, getUserChats, getChatMessages, updateChat, getPartnerId, deleteAll } from "./../controllers/chatController.js";

const chatRouter = Router();
chatRouter.post('/saveChat', saveChat);
chatRouter.get('/getUserChats/:userId', getUserChats);
chatRouter.get('/getChatMessages/:userId/:chatId', getChatMessages);
chatRouter.post('/updateChat', updateChat);
chatRouter.get('/getPartnerId/:userId/:chatId', getPartnerId);
chatRouter.delete('/deleteAll', deleteAll);

export default chatRouter;