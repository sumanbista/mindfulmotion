const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User'); // Import user model
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Get all posts
console.log('→ mounting communityRoutes') 
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName')
      .populate('comments.userId', 'firstName lastName')
      .lean();

    // format author, loves count, comments…
    const formatted = posts.map(post => ({
      ...post,
      author: `${post.userId.firstName} ${post.userId.lastName}`,
      loves: post.loves.length,
      comments: post.comments.map(c => ({
        ...c,
        author: `${c.userId.firstName} ${c.userId.lastName}`
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new post
router.post('/', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }
    const newPost = new Post({
      userId: req.user._id,
      content: content.trim(),
      comments: [],
      loves: []
    });
    await newPost.save();

    // build the response directly from req.user
    const postResponse = {
      ...newPost.toObject(),
      author: `${req.user.firstName} ${req.user.lastName}`,
      userLoved: false,
      comments: []
    };
    res.status(201).json(postResponse);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add comment to a post
router.post('/:postId/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create new comment
    const newComment = {
      userId: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    };
    post.comments.push(newComment);
    await post.save();
    
    // you already have req.user
    const commentResponse = {
      ...newComment,
      _id: post.comments[post.comments.length - 1]._id,
      author: `${req.user.firstName} ${req.user.lastName}`
    };
    res.status(201).json(commentResponse);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle love reaction
router.put('/:postId/love', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already loved the post
    const userIndex = post.loves.findIndex(id => id.toString() === userId.toString());
    let userLoved = false;

    if (userIndex > -1) {
      // User already loved the post, remove the love
      post.loves.splice(userIndex, 1);
    } else {
      // User hasn't loved the post, add the love
      post.loves.push(userId);
      userLoved = true;
    }

    await post.save();

    // Return only the count of loves, not the array of user IDs
    res.json({ 
      loves: post.loves.length, 
      userLoved
    });
  } catch (error) {
    console.error('Error toggling love reaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
