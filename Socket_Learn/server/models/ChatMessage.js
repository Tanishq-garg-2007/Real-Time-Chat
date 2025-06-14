import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    room_name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model("ChatMessage", ChatSchema);
export default ChatMessage;
