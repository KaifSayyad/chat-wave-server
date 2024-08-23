import express from 'express';
import { Router } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import Users from './models/userModel.js';
import Chats from './models/chatModel.js';
import Messages from './models/messageModel.js';
import { Server } from 'socket.io';

import socketRouter from './routes/sockerRouter.js';
import userRouter from './routes/userRouter.js';



const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8888;
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://kaifalisayyad:pDW7d4wqwCTI1zUN@cluster0.is9kj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const expressServer = app.listen(SERVER_PORT, (req, res) => {
    console.log('Server is running on port',SERVER_PORT);
});


mongoose.connect(MONGO_URL).then(
    app.listen(MONGO_PORT, () => console.log(`Mongo Server running on port: http://localhost:${MONGO_PORT}/`))
).catch((error) => console.log(error.message));


const io = new Server(expressServer, {
    cors: {
        origin: '*',
    },
    path: '/socket.io'
});

let queue = [];

const socketMap = new Map();
const partnerMap = new Map();

io.on('connection', (socket) => {
    console.log(`A user connected with socket id = ${socket.id}`);
    socketMap.set(socket.id, socket);

    socket.on('disconnect', () => {
        console.log(`User disconnected with socket id = ${socket.id}`);
        const partnerId = partnerMap.get(socket.id);
        if (partnerId) {
            const partnerSocket = socketMap.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-disconnected');
            }
            partnerMap.delete(partnerId);
            partnerMap.delete(socket.id);
        }
        socketMap.delete(socket.id);
    });

    socket.on('forceDisconnect', function () {
        const partnerId = partnerMap.get(socket.id);
        if (partnerId) {
            const partnerSocket = socketMap.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-disconnected');
            }
            partnerMap.delete(partnerId);
            partnerMap.delete(socket.id);
        }
        socketMap.delete(socket.id);
        socket.disconnect();
    });

    socket.on('look-for-partner', (data) => {
        if (queue.length == 0) {
            queue.push(data);
        } else {
            let partnerId = queue.pop();
            socket.emit('partner-found', partnerId);
            const partnerSocket = socketMap.get(partnerId);
            if (partnerSocket) {
                partnerSocket.emit('partner-found', socket.id);
            }
            partnerMap.set(socket.id, partnerId);
            partnerMap.set(partnerId, socket.id);
        }
    });

    socket.on('stop-searching', (data) => {
        const index = queue.indexOf(data);
        if (index > -1) {
            queue.splice(index, 1);
        }
    });

    socket.on('message', (data) => {
        try {
            const partnerId = partnerMap.get(socket.id);
            if(partnerId){
                const partnerSocket = socketMap.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit('message', data);
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    });
});

const router = Router();
app.use('/api', router);
router.use('/socket', socketRouter);
router.use('/users', userRouter);
