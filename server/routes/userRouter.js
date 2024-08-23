import e, { Router } from "express";
import { addUser } from './../controllers/userController.js';

const userRouter = Router();

userRouter.post("/addUser", addUser);

export default userRouter;