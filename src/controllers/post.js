const { default: mongoose } = require('mongoose');
const PostMessage = require('../models/postMessage.js');
const User = require('../models/user');
const getPosts = async (req, res) => {
  try {
    const { page } = req.query;
    const limit = 8;
    const startIndex = (Number(page) - 1) * limit;
    const totalPost = await PostMessage.countDocuments({});

    const postMessages = await PostMessage.find().sort({ _id: -1 }).limit(limit).skip(startIndex);

    res.status(200).json({
      data: postMessages,
      currentPage: startIndex,
      numberOfPage: Math.ceil(totalPost / limit),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostMessage.find({ _id: id });
    res.status(200).json({
      data: post,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const createPost = async (req, res) => {
  const post = req.body;
  try {
    const newPost = new PostMessage({
      ...post,
      creator: req.userId,
      createdAt: new Date().toString(),
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const modifyPost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId(id)) res.status(404).send(`No post with id: ${id}`);
  await PostMessage.findByIdAndUpdate(id, post, { new: true });
  res.json(post);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId(id)) res.status(404).send(`No post with id: ${id}`);
  await PostMessage.findOneAndDelete({ _id: id });
  res.json({ message: 'Post deleted successfully.' });
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.userId) {
      return res.json({ message: 'Unauthenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
  }
};
const searchPosts = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id, comment, name } = req.body;
    if (!req.userId) {
      return res.json({ message: 'Unauthenticated' });
    }
    let post = await PostMessage.findOne({ _id: id });
    const postUpdate = await PostMessage.findByIdAndUpdate(
      id,
      {
        comments: [...post.comments, { id: req.userId, comment, name }],
      },
      { new: true }
    );
    res.json({ data: postUpdate });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
module.exports = {
  getPosts,
  createPost,
  modifyPost,
  deletePost,
  likePost,
  searchPosts,
  getPost,
  addComment,
};
