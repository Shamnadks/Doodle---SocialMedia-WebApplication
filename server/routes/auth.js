import express from "express";
import { login,verifyOTP } from "../controllers/auth.js";

const router = express.Router();


router.post("/login",login);
router.post("/verifyOTP",verifyOTP);

export default router;
