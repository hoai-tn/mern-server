const express = require("express");
const { getPosts, createPost, modifyPost, deletePost, likePost } = require("../controllers/post");
const router = express.Router();

router.get("/", getPosts);
router.post("/creator", createPost);
router.patch("/:id", modifyPost);
router.delete('/:id', deletePost);
router.patch('/:id/like-post', likePost);
module.exports = router;
