const express = require("express");
const {
  getPosts,
  createPost,
  modifyPost,
  deletePost,
  likePost,
  searchPosts,
  getPost,
  addComment,
} = require("../controllers/post");
const router = express.Router();
const auth = require("../middlewares/auth.js");
router.get("/search", searchPosts);
router.post("/comments", auth, addComment);
router.post("/creator", auth, createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.patch("/:id", auth, modifyPost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/like-post", auth, likePost);
module.exports = router;
