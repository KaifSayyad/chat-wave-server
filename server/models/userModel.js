import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true // Ensure userId is unique
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chats'
  }]
});

const User = mongoose.model('User', userSchema);

export default User;
