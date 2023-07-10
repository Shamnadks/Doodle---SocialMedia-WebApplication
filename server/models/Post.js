import mongoose from "mongoose";
const Schema= mongoose.Schema,
ObjectId = Schema.ObjectId;


const commentSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        },
    lastName: {
        type: String,
        required: true,
        },
    text: {
      type: String,
      required: true,
    },
    userPicturePath: {
        type: String,
        required: true,
        },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    location:String,
    description:String,
    picturePath:String,
    userPicturePath:String,
    likes:{
        type:Map,
        of: Boolean,
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps: true});

const Post = mongoose.model("Post",postSchema);

export default Post;