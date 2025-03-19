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

module.exports = router;
