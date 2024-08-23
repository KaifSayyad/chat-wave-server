import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true,
        unique: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Messages = mongoose.model('Messages', messageSchema);

export default Messages;