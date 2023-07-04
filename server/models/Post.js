import mongoose from "mongoose";
const Schema= mongoose.Schema,
ObjectId = Schema.ObjectId;

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
    comments:{
        type:Array,
        default:[]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps: true});

const Post = mongoose.model("Post",postSchema);

export default Post;