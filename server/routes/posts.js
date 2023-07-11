import express from 'express';
import multer from "multer";
import { verifyToken } from '../middleware/auth.js';
import postController from "../controllers/posts.js";
import storage  from "../utils/cloudinary.js";

const upload = multer({ storage })

const router = express.Router();


router.get("/",verifyToken,postController.getFeedPosts);
router.get("/:userId/posts",verifyToken,postController.getUserPosts);

router.post("/:postId/comments/:_Id",postController.createComment);
router.delete("/:postId/comments/:_Id",postController.deleteComment);

router.put("/:postId/report/:_Id",postController.reportPost);
router.get("/reports/:id", postController.allReports);
router.delete("/:id/report", postController.rejectReport);
router.delete("/:id/rejectReport", postController.resolveReport);

router.post("/",verifyToken,upload.single("picture"),postController.createPost);
router.patch("/:id/like",verifyToken,postController.likePost);


router.delete("/:id",verifyToken,postController.deletePost);



export default router;
