import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(), // Default unique ID
  },
  body: {
    type: String,
    required: true
  },
  from : {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
