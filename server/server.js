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
import { createClient } from 'redis';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8888;
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://kaifalisayyad:pDW7d4wqwCTI1zUN@cluster0.is9kj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create an Express server
const expressServer = app.listen(SERVER_PORT, (req, res) => {
    console.log('Server is running on port',SERVER_PORT);
});

// Connect to MongoDB
mongoose.connect(MONGO_URL).then(
    app.listen(MONGO_PORT, () => console.log(`Mongo Server running on port: http://localhost:${MONGO_PORT}/`))
).catch((error) => console.log(error.message));

// Create a Redis client
const client = createClient({
    password: 'eFv1GynZU4ZkHKjzDXXzBxmbar6BkMUn',
    socket: {
        host: 'redis-19418.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 19418
    }
});

client.on('error', (err) => {
    console.log('Error: ' + err);
});

//Connecting to the redis client
await client.connect();


// Create a Socket.IO server
const io = new Server(expressServer, {
    cors: {
        origin: '*',
    },
    path: '/socket.io'
});


let queue = [];

const socketMap = new Map();
const partnerMap = new Map();

// Handle socket connection
io.on('connection', (socket) => {
    console.log(`A user connected with socket id = ${socket.id}`);
    socketMap.set(socket.id, socket);

    // Handle socket disconnection
    socket.on('disconnect', async (data) => {
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
        const index = queue.indexOf(socket.id);
        if (index > -1) {
            queue.splice(index, 1);
        }
        // await client.del(data.userId, (err, reply) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log(reply);
        // });
    });

    // Handle forced socket disconnection
    socket.on('forceDisconnect',async function (data) {
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
        const index = queue.indexOf(socket.id);
        if (index > -1) {
            queue.splice(index, 1);
        }
        // await client.del(data.userId);
        socket.disconnect();
    });

    // Handle searching for a partner
    socket.on('look-for-partner', (data) => {
        // console.log(`queue = ${queue}`);
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
            console.log(`Partner found for ${socket.id} and ${partnerId}`);
        }
    });

    // Handle stopping the search for a partner
    socket.on('stop-searching', (data) => {
        const index = queue.indexOf(data);
        if (index > -1) {
            queue.splice(index, 1);
        }
    });

    // Handle sending messages
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

    //Add user to redis cache
    socket.on('add-to-redis', async (data) => {
        try{
            // console.log(data);
            if(data !== null && data !== undefined && data.socketId !== null && data.socketId !== undefined){
                await client.set(data.userId, data.socketId);
            }
            else {
                console.log('SocketId is null or undefined');
            }
        } catch (error) {
            console.error(error);
        }
    });

    //Temporary function to test redis cache
    socket.on('get-from-redis', async (data) => {
        try{
            const value = await client.get(data.userId);
            console.log(`userId = ${data.userId}, socketId = ${value}`);

        } catch (error) {
            console.error(error);
        }
    });


});

const router = Router();
app.use('/api', router);
router.use('/socket', socketRouter);
router.use('/users', userRouter);
