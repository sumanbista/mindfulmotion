const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User'); // Import user model
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    // Get user ID from token if available
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.userId;
        console.log('Current user ID from token:', currentUserId);
      } catch (error) {
        console.log('Invalid token, continuing as guest');
      }
    }

    // Fetch posts with user information
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName')
      .populate('comments.userId', 'firstName lastName')
      .lean();

    // Process posts to add userLoved flag
    const postsWithUserInfo = posts.map(post => {
      // Check if current user has liked this post
      let userLoved = false;
      
      if (currentUserId) {
        // Convert all ObjectIds to strings for comparison
        const loveIds = post.loves.map(id => id.toString());
        userLoved = loveIds.includes(currentUserId.toString());
      }
      
      return {
        ...post,
        author: post.userId ? `${post.userId.firstName} ${post.userId.lastName}` : 'Unknown User',
        loves: post.loves.length, // Only send the count
        userLoved, // This flag tells frontend if current user liked the post
        comments: post.comments.map(comment => ({
          ...comment,
          author: comment.userId ? `${comment.userId.firstName} ${comment.userId.lastName}` : 'Unknown User',
        }))
      };
    });

    res.json(postsWithUserInfo);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new post
router.post('/', protect, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Post content is required' });
    }

    // Create new post document
    const newPost = new Post({
      userId: req.user.userId,
      content: content.trim(),
      comments: [],
      loves: []
    });

    // Save to database
    await newPost.save();

    // Get user info for the response
    const user = await User.findById(req.user.userId);
    
    // Format response with author name
    const postResponse = {
      ...newPost.toObject(),
      _id: newPost._id,
      author: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
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
      userId: req.user.userId,
      text: text.trim(),
      createdAt: new Date()
    };

    // Add comment to post
    post.comments.push(newComment);
    await post.save();

    // Get user info for the response
    const user = await User.findById(req.user.userId);
    
    // Format response
    const commentResponse = {
      ...newComment,
      _id: post.comments[post.comments.length - 1]._id,
      author: user ? `${user.firstName} ${user.lastName}` : 'Unknown User'
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
