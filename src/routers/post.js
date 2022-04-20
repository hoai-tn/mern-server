const express = require("express");
const { getPosts, createPost } = require("../controllers/post");
const router = express.Router();

router.get("/", getPosts);
router.post("/creator", createPost)
module.exports = router;
