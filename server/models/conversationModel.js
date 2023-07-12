import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    lastMsg:{
      type: Number,
      default: 1
    },
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", ConversationSchema);
export  default ConversationModel