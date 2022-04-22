const { default: mongoose } = require("mongoose");
const PostMessage = require("../models/postMessage.js");

const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = new PostMessage(post);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const modifyPost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId(id))
    res.status(404).send(`No post with id: ${id}`);
  await PostMessage.findByIdAndUpdate(id, post, { new: true });
  console.log(post);
  res.json(post);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId(id))
    res.status(404).send(`No post with id: ${id}`);
  await PostMessage.findOneAndDelete({ _id: id });
  res.json({ message: "Post deleted successfully." });
};

const likePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId(id))
    res.status(404).send(`No post with id: ${id}`);
  const post = await PostMessage.findById(id);
  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );
  res.json(updatedPost);
};

module.exports = { getPosts, createPost, modifyPost, deletePost, likePost };
