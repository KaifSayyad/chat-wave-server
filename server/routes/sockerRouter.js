import { Router } from "express";
import { getSocket, updateSocket } from "../controllers/socketController.js";

const socketRouter = Router();

socketRouter.get("/getSocket", getSocket);
socketRouter.post("/updateSocket", updateSocket);

export default socketRouter;
