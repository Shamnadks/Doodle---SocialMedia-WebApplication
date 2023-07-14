import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getSearchUsers,
  } from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();



router.get("/:id",verifyToken,getUser);
router.get("/:id/friends",verifyToken,getUserFriends);

router.get("/search/:search",getSearchUsers)
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);

export default router;

