import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8888;

const expressServer = app.listen(SERVER_PORT, (req, res) => {
    console.log('Server is running on port',SERVER_PORT);
});


app.get('/', (req, res) => {
    res.send(req.headers);
});

const io = new Server(expressServer, {
    cors: {
        origin: '*',
    },
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