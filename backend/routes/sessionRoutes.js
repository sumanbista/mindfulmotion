const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authMiddleware = require('../middleware/authMiddleware');

// Get all sessions (protected route example)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a session (could be restricted to admin users)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, duration, focus, rating, embedHtml } = req.body;
    const newSession = new Session({ title, duration, focus, rating, embedHtml });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET average rating for a session
router.get('/:sessionId/ratings', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    
    // Fetch all ratings for this session from database
    const ratings = await Rating.find({ sessionId });
    
    if (ratings.length === 0) {
      return res.json({ averageRating: 0, count: 0 });
    }
    
    // Calculate average
    const sum = ratings.reduce((total, rating) => total + rating.value, 0);
    const average = sum / ratings.length;
    
    res.json({ 
      averageRating: parseFloat(average.toFixed(1)), 
      count: ratings.length 
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new rating or update existing one
router.post('/:sessionId/ratings', async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const sessionId = req.params.sessionId;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if user already rated this session
    const existingRating = await Rating.findOne({ sessionId, userId });
    
    if (existingRating) {
      // Update existing rating
      existingRating.value = rating;
      await existingRating.save();
    } else {
      // Create new rating
      await Rating.create({
        sessionId,
        userId,
        value: rating
      });
    }
    
    // Calculate new average
    const allRatings = await Rating.find({ sessionId });
    const sum = allRatings.reduce((total, r) => total + r.value, 0);
    const average = sum / allRatings.length;
    
    res.json({ 
      success: true, 
      averageRating: parseFloat(average.toFixed(1)),
      count: allRatings.length
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
