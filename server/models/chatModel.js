import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  user1Id: {
    type: String,
    required: true
  },
  user2Id: {
    type: String,
    ref: 'User',
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
