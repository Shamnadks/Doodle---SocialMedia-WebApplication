import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import postController from "../controllers/posts.js";


const router = express.Router();


router.get("/",verifyToken,postController.getFeedPosts);
router.get("/:userId/posts",verifyToken,postController.getUserPosts);



router.patch("/:id/like",verifyToken,postController.likePost);


router.delete("/:id",verifyToken,postController.deletePost);



export default router;
