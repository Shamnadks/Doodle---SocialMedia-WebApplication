import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    text: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const MessageModel= mongoose.model("Message", MessageSchema);
export default MessageModel