import { Router } from "express";
import {
  addPosts,
  deletePosts,
  getDetailPosts,
  getPostsSimilar,
  updatePosts,
  searchPosts,
  getUsers,
} from "../../controller/posts/posts.js";
import { verifyToken } from "../../middleware/auth.js";

const router = Router();

router.get("/search/", searchPosts);
router.get("/", getUsers);
router.get("/:id", getDetailPosts);
router.get("/similar/:id", getPostsSimilar);
router.post("/addposts/", verifyToken, addPosts);
router.delete("/deleteposts/:id", verifyToken, deletePosts);
router.put("/updateposts/:id", verifyToken, updatePosts);

export default router;
