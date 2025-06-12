import mongoose from "mongoose";
const {Schema} = mongoose;

const ChatSchema = new Schema({
    room_name:{
        type: String,
        required: true,
        unique: true,
    },

    user_name:{
        type: String,
        required: true,
    },

    message:{
        type: String,
        required: true,
    }
})

const Chat = mongoose.model('chat', ChatSchema);
export default Chat;
