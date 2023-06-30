import User from "../models/User.js"
import Admin from "../models/Admin.js"
import jwt from "jsonwebtoken"



export const adminLogin= async (req,res)=>{
    try{
        const {email,password} =req.body;
        const admin = await Admin.findOne({email:email});
        if(!admin) return res.status(404).json({msg : "Admin not Found"});
        if(password !== admin.password)return res.status(400).json({msg:"invalid credentials"});

        const token = jwt.sign({id:admin._id},process.env.JWT_SECRET);
        delete admin.password;
        res.status(200).json({token,admin})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const blockUnblockUser = async (req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        const userName = user.firstName + " " + user.lastName;
        if(user.isblock){
            user.isblock = false;
        }else{
            user.isblock = true;
        }
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json({error:err.message})
    }
}



export const getUsers = async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({error:err.message})
    }
}



export default {adminLogin ,getUsers,blockUnblockUser};