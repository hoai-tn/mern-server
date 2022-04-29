const express = require("express");
const {
  getPosts,
  createPost,
  modifyPost,
  deletePost,
  likePost
} = require("../controllers/post");
const router = express.Router();
const auth = require("../middlewares/auth.js");
router.get("/", getPosts);
router.post("/creator", auth, createPost);
router.patch("/:id", auth, modifyPost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/like-post", auth, likePost);

module.exports = router;
