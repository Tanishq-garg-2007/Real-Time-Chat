const mongoose = require('mongoose');

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

module.exports = mongoose.model('chat',ChatSchema);