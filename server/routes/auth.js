import express from "express";
import { login,verifyOTP,googleSignIn } from "../controllers/auth.js";

const router = express.Router();


router.post("/login",login);
router.post("/verifyOTP",verifyOTP);
router.post("/google",googleSignIn);

export default router;
