import mongoose from "mongoose";

const UserSchema= new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            min:2,
            max:50,
        },
        lastName:{
            type:String,
            required:true,
            min:2,
            max:50,
        },
        email:{
            type:String,
            required:true,
            max:50,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            min:5,
        },
        picturePath:{
            type:String,
            default:
                "https://www.kindpng.com/picc/m/780-7804962_cartoon-avatar-png-image-transparent-avatar-user-image.png",
        
        },
        friends:{
            type:Array,
            default:[]
        },
        isblock:{
            type:Boolean,
            default:false
        },
        location:String,
        occupation :String,
        viewedProfile:Number,
        impressions:Number,


},{ timestamps:true }
);


const User = mongoose.model("User",UserSchema);

export default User;