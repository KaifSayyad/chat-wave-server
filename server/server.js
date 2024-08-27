import express from 'express';
import { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import Users from './models/userModel.js';
import Chats from './models/chatModel.js';
import Messages from './models/messageModel.js';
import { Server } from 'socket.io';
import socketRouter from './routes/socketRouter.js';
import userRouter from './routes/userRouter.js';
import chatRouter from './routes/chatRouter.js';
import { createClient } from 'redis';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SERVER_PORT = process.env.SERVER_PORT;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_URL = process.env.MONGO_URL;

// Create an Express server
const expressServer = app.listen(SERVER_PORT, (req, res) => {
    console.log('Server is running on port',SERVER_PORT);
});

// Connect to MongoDB
mongoose.connect(MONGO_URL).then(
    app.listen(MONGO_PORT, () => console.log(`Mongo Server running on port: http://localhost:${MONGO_PORT}/`))
).catch((error) => console.log("mongo error", error.message));

// Create a Redis client
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', (err) => {
    console.log('Redis Error: ' + err);
});

client.on('connect', () => {
    console.log('Redis connected on port:', process.env.REDIS_PORT);
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

const socketMap = new Map();                //Map of socketId, socket
const partnerMap = new Map();               //Map of socketId, socketId
const socket_userId = new Map();            //Map of socketId, userId
const specificPartnerMap = new Map();       //Map of userId, userId
const userId_socket = new Map();            //Map of userId, socketId


// Handle socket connection
io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`A user connected with socket id = ${socket.id} and userId = ${userId ? userId : 'Anonymous' }`);
    socketMap.set(socket.id, socket);
    if(userId){
        socket_userId.set(socket.id, userId);
        userId_socket.set(userId, socket.id);
    }
    if(userId) await client.set(userId, socket.id);

    // Handle socket disconnection
    socket.on('disconnect', async () => {
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
        try{
            await client.del(socket_userId.get(socket.id));
            socket_userId.delete(socket.id);
            userId_socket.delete(socket_userId.get(socket.id));
        }catch(error){
            console.error("Anonymous user disconnected");
        }
        const index = queue.indexOf(socket.id);
        if (index > -1) {
            queue.splice(index, 1);
        }
    });

    // Handle forced socket disconnection
    socket.on('forceDisconnect',async () => {
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
        socket.disconnect();
    });

    // Handle searching for a partner
    socket.on('look-for-partner', (data) => {
        // console.log(`queue = ${queue}`);
        if (queue.length == 0) {
            queue.push(data);
        } else {
            let partnerId = queue.pop();
            if(partnerId !== data){
                socket.emit('partner-found', partnerId);
                const partnerSocket = socketMap.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit('partner-found', socket.id);
                }
                partnerMap.set(socket.id, partnerId);
                partnerMap.set(partnerId, socket.id);
                console.log(`Partner found for ${socket.id} and ${partnerId}`);
            }
        }
    });

    //Look for partner with specific id
    socket.on('look-for-partnerId', (data) =>{
        const partnerId = data.partnerId;
        if(specificPartnerMap.get(partnerId)){
            const partnerSocketId = userId_socket.get(partnerId);
            const partnerSocket = socketMap.get(partnerSocketId);
            socket.emit('partner-found', partnerSocketId);
            if (partnerSocket) {
                partnerSocket.emit('partner-found', socket.id);
            }
            partnerMap.set(socket.id, partnerSocketId);
            partnerMap.set(partnerSocketId, socket.id);
            specificPartnerMap.delete(partnerId);
            console.log(`Partner found for ${socket.id} and ${partnerSocketId}`);
        }
        else{
            specificPartnerMap.set(socket_userId.get(socket.id), partnerId);
        }
        // console.log(specificPartnerMap);
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
                    // console.log(`Message from ${socket.id} to ${partnerId}`, data);
                    partnerSocket.emit('message', data);
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    });
    
    //Handle save message request
    socket.on('send-save-request', async () => {
        // console.log("Sending Save request");
        try {
            const partnerId = partnerMap.get(socket.id);
            if(partnerId){
                const partnerSocket = socketMap.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit('save-request');
                }
            }else{
                console.log('Partner not found');
            }
        } catch (error) {
            console.error(error);
        }
    });

    //Handle save-request-accepted
    socket.on('save-request-accepted', async (data) => {
        // console.log("Save request accepted");
        try {
            const partnerId = partnerMap.get(socket.id);
            if(partnerId){
                const partnerSocket = socketMap.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit('save-request-accepted', data);
                }
            }else{
                console.log('Partner not found');
            }
        } catch (error) {
            console.error(error);
        }
    });

    //Handle save request rejected
    socket.on('save-request-rejected', async () => {
        // console.log("Save request rejected");
        try {
            const partnerId = partnerMap.get(socket.id);
            if(partnerId){
                const partnerSocket = socketMap.get(partnerId);
                if (partnerSocket) {
                    partnerSocket.emit('save-request-rejected');
                }
            }else{
                console.log('Partner not found');
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
            console.error('User not present in redis cache');
        }
    });

    

});

const router = Router();
app.use('/api', router);
router.use('/socket', socketRouter);
router.use('/users', userRouter);
router.use('/chats', chatRouter);