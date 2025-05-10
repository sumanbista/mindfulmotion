const express = require('express');
const jwt     = require('jsonwebtoken');
const { Groq }= require('groq-sdk');
const authenticateUser = require('../middleware/authMiddleware');
const ChatSession      = require('../models/ChatSession');
const ChatMessage      = require('../models/ChatMessage');

const router = express.Router();
const groq   = new Groq({ apiKey: process.env.GROQCLOUD_API_KEY });

// All routes require an authenticated user
router.use(authenticateUser);

// 1) List all sessions for this user
//    GET /api/aichat/sessions
router.get('/sessions', async (req, res) => {
  const sessions = await ChatSession.find({ userId: req.user._id })
    .sort({ updatedAt: -1 })
    .lean();
  res.json(sessions);
});

// 2) Create a new session
//    POST /api/aichat/sessions
router.post('/sessions', async (req, res) => {
  const session = await ChatSession.create({
    userId: req.user._id,
    title: req.body.title || 'New Conversation'
  });
  res.status(201).json(session);
});

// 3) Get history for one session
//    GET /api/aichat/history/:sessionId
router.get('/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const history = await ChatMessage.find({ sessionId })
    .sort({ createdAt: 1 })
    .lean();
  res.json(history);
});

// 4) Send a message (creates session if none), call AI, persist both
router.post('/send', async (req, res) => {
  try {
    let { sessionId, text } = req.body;
    text = (text || '').trim();
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const userId = req.user._id;

    // If no session, create one
    if (!sessionId) {
      const newSession = await ChatSession.create({
        userId,
        title: text.slice(0, 50),
      });
      sessionId = newSession._id;
    }

    // Save user message
    await ChatMessage.create({ sessionId, role: 'user', text });

    // Call Groq LLM
    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: 'You are an expert mental-health counselor.' },
        { role: 'user', content: text },
      ],
      temperature: 0.8,
      max_completion_tokens: 512,
      stream: false,
    });

    const reply = completion.choices?.[0]?.message?.content || "I'm sorry, I can't respond right now.";

    // Save assistant reply
    await ChatMessage.create({ sessionId, role: 'assistant', text: reply });

    // Update session timestamp
    await ChatSession.findByIdAndUpdate(sessionId, {}, { timestamps: true });

    res.json({ sessionId, reply });
  } catch (error) {
    console.error(' Error in /api/aichat/send:', error); 
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
