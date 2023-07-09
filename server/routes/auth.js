import express from "express";
import multer from "multer";
import { login,verifyOTP,googleSignIn,register } from "../controllers/auth.js";
import storage  from "../utils/cloudinary.js";

const upload = multer({ storage })

const router = express.Router();

router.post("/register",upload.single("picture"),register);
router.post("/login",login);
router.post("/verifyOTP",verifyOTP);
router.post("/google",googleSignIn);

export default router;
