import express from "express";
import adminController from "../controllers/admin.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

router.get("/users",adminController.getUsers);
router.patch("/users/blockUnblock/:id",adminController.blockUnblockUser);
router.post("/login",adminController.adminLogin);

export default router;