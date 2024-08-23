import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    user1Id: {
        type: String,
        required: true
    },
    user2Id: {
        type: String,
        required: true
    },
    chatCreatedTimestamp: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Chats = mongoose.model('Chats', chatSchema);

export default Chats;
