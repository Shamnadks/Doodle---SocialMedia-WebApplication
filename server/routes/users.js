import express from "express";
import multer from "multer";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getSearchUsers,
    getUserFollowers,
    editUserWithImage,
    editUser
  } from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";
import storage  from "../utils/cloudinary.js";

const upload = multer({ storage })

const router = express.Router();



router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriends);
router.get("/:id/followers",verifyToken,getUserFollowers);

router.get("/search/:search",getSearchUsers)
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);

router.post("/uploadImage/editProfile",verifyToken,upload.single("picture"),editUserWithImage);
router.patch("/editProfile",verifyToken,editUser);


export default router;

