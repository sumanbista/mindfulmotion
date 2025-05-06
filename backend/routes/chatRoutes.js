// backend/routes/chatRoutes.js
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
//    POST /api/aichat/send
router.post('/send', async (req, res) => {
  let { sessionId, text } = req.body;
  text = (text || '').trim();
  if (!text) return res.status(400).json({ message: 'Text is required' });

  // 4a) If no sessionId, create one
  if (!sessionId) {
    const newSession = await ChatSession.create({
      userId: req.user._id,
      title: text.slice(0,50)  // first words as title
    });
    sessionId = newSession._id;
  }

  // 4b) Persist user message
  await ChatMessage.create({ sessionId, role: 'user', text });

  // 4c) Call the LLM
  const completion = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      { role: 'system', content: 'You are an expert mental-health counselor.' },
      { role: 'user',   content: text }
    ],
    temperature: 0.8,
    max_completion_tokens: 512,
    stream: false
  });

  const reply = completion.choices?.[0]?.message?.content || 'I\'m sorry, I can’t respond right now.';

  // 4d) Persist assistant reply
  await ChatMessage.create({ sessionId, role: 'assistant', text: reply });

  // 4e) Touch session’s updatedAt so it shows first in list
  await ChatSession.findByIdAndUpdate(sessionId, {}, { timestamps: true });

  res.json({ sessionId, reply });
});

module.exports = router;
