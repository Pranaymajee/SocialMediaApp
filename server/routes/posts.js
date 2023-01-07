import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);// GET ALL THE POSTS TO BE SHOWN IN THE FEED
router.get("/:userId/posts", verifyToken, getUserPosts);// GET ALL THE POSTS OF THE USER

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);// FOR LIKING AND DISLIKING THE POSTS

export default router;