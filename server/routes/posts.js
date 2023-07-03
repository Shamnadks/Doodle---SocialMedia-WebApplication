import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import postController from "../controllers/posts.js";


const router = express.Router();

// read
router.get("/",verifyToken,postController.getFeedPosts);
router.get("/:userId/posts",verifyToken,postController.getUserPosts);


// update
router.patch("/:id/like",verifyToken,postController.likePost);

// delete
router.delete("/:id",verifyToken,postController.deletePost);



export default router;
