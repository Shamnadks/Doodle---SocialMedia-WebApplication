import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    emiterId: {
      type: String,
    },
    text: {
      type: String,
    },
    postId: {
      type: String,
    },
    isVisited: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("notifications", NotificationSchema);
export default NotificationModel