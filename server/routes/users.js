import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getSearchUsers,
    getUserFollowers
  } from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();



router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriends);
router.get("/:id/followers",verifyToken,getUserFollowers);

router.get("/search/:search",getSearchUsers)
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);

// router.put('/follow/:id/:friendId', followUser)

// router.put('/unfollow/:id/:friendId', UnfollowUser)

export default router;

