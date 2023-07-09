import express from 'express';
import multer from "multer";
import { verifyToken } from '../middleware/auth.js';
import postController from "../controllers/posts.js";
import storage  from "../utils/cloudinary.js";

const upload = multer({ storage })

const router = express.Router();


router.get("/",verifyToken,postController.getFeedPosts);
router.get("/:userId/posts",verifyToken,postController.getUserPosts);


router.post("/",verifyToken,upload.single("picture"),postController.createPost);
router.patch("/:id/like",verifyToken,postController.likePost);


router.delete("/:id",verifyToken,postController.deletePost);



export default router;
