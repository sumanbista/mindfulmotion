const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authMiddleware = require('../middleware/authMiddleware');

// Get all sessions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({});
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a session 
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
    const sessionId = req.params.sessionId
    const userId    = req.user._id        
    const { rating } = req.body

    if (rating == null) {
      return res.status(400).json({ message: 'Rating is required' })
    }

    // upsert Rating document
    let existing = await Rating.findOne({ sessionId, userId })
    if (existing) {
      existing.value = rating
      await existing.save()
    } else {
      await Rating.create({ sessionId, userId, value: rating })
    }

    // recompute average
    const all = await Rating.find({ sessionId })
    const avg = all.reduce((sum, r) => sum + r.value, 0) / all.length

    res.json({ averageRating: parseFloat(avg.toFixed(1)), count: all.length })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports = router;
