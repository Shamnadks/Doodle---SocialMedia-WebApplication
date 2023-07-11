import mongoose from "mongoose";
const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: { type: String },
    reason: { type: String },
    postId: { type: String },
    post: { type: String },
    desc: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);


const ReportModel = mongoose.model("Report",ReportSchema)
export default ReportModel

  