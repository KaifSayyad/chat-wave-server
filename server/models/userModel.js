import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    socket: {
        type: String,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

export default User;