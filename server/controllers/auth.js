dotenv.config();
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import OTPModel from "../models/OtpData.js";

const generateOTP = () => {
    const otpLength = 6;
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < otpLength; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  };



// REGISTER USER

// export const register = async (req,res) =>{
//     try{
//         const { firstName,lastName,email,password,picturePath,friends,location,occupation } = req.body;

//         const salt = await bcrypt.genSalt();
//         const hashedPassword = await bcrypt.hash(password,salt);
//         const user = await User.find({email:email});
//         if(user.length !== 0) return res.status(400).json({msg:"User already exists"});
//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             password : hashedPassword,
//             picturePath,
//             friends,
//             location,
//             occupation,
//             viewedProfile: Math.floor(Math.random() * 1000),
//             impressions: Math.floor(Math.random() * 1000)
//         })

//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser)

//     }catch(err){
//         res.status(500).json({error:err.message});
//     }
// }


export const register = async (req, res) => {
    try {
      const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await User.find({ email: email });
      if (user.length !== 0) return res.status(400).json({ msg: "User already exists" });
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath,
        friends,
        location,
        occupation,
      });
  
      const otp = generateOTP();
  
      // Configure Nodemailer with your email provider settings
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.emailUser,
          pass: process.env.emailPassword
        }
      });
  
      // Compose the email message
      const mailOptions = {
        from: "shamnadkskannur@gmail.com",
        to: email,
        subject: "Doodle SignUp OTP",
        text: `Your OTP for Doodle SignUp is: ${otp} , Don't share Your One Time Password \n\nThanks,\nDoodle Team`
      };
  
      // Send the email
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Failed to send OTP" });
        } else {
          // Save the OTP and user details in a temporary collection
          await OTPModel.create({
            email: email,
            otp: otp,
            user: newUser
          });
  
          res.status(200).json({ msg: "OTP sent , please check your email", email: email });
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  export const verifyOTP = async (req, res) => {
    try {
      const { otp, email } = req.body;
      const otpData = await OTPModel.findOne({ email: email, otp: otp });

      if (!otpData) return res.status(400).json({ error: "Entered OTP invalid" });

      const newUser = new User({
        firstName:otpData.user.firstName,
        lastName:otpData.user.lastName,
        email:otpData.user.email,
        password: otpData.user.password,
        picturePath:otpData.user.picturePath,
        location:otpData.user.location,
        occupation:otpData.user.occupation,
        viewedProfile: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1000)
      });
      await newUser.save();
      await OTPModel.deleteOne({ _id: otpData._id });
      return res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


// login user

export const login = async (req,res) =>{
    try{
        const {email,password} =req.body;
        const user = await User.findOne({email:email});
        if(!user) return res.status(404).json({msg: "User not Found"});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)return res.status(400).json({msg:"invalid credentials"});

        if(user.isblock === true) return res.status(400).json({msg:"You are blocked by admin , please contact admin"});

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token,user})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const googleSignIn = async (req, res) => {
    try {
      const { firstName, lastName, email, picturePath ,location,occupation} = req.body;
      if(!email || !firstName || !lastName || !picturePath) return res.status(400).json({ error: "Please fill all the required fields" });

      
        const user = await User.findOne({email:email});
        if(user){
          const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
          delete user.password;
          return res.status(200).json({token,user})
        }

        const newUser = new User({
          firstName,
          lastName,
          email,
          picturePath,
          location,
          occupation,
          viewedProfile: Math.floor(Math.random() * 1000),
          impressions: Math.floor(Math.random() * 1000)
        });
        await newUser.save();
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
        delete newUser.password;
        res.status(200).json({token,user:newUser})
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
    








export default { register,login, verifyOTP ,googleSignIn};