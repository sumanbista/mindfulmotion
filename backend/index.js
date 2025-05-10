require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const communityRoutes = require('./routes/communityRoutes');
const assessmentAnalysisRoutes = require('./routes/assessmentAnalysis');
const UserAssessment = require('./models/UserAssessment');
const chatRoutes = require('./routes/chatRoutes');

const app = express();


const allowedOrigins = [
  'https://mindfulmotion.vercel.app',
  'https://mindfulmotion.netlify.app',
  'http://localhost:5173' // For local development
];

app.use(cors({
  origin: function(origin, callback) {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching quote from ZenQuotes' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ message: 'Error fetching quote', error });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/assessment', assessmentAnalysisRoutes);

// Route to get past user assessments
app.get('/api/assessment/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const assessments = await UserAssessment.find({ userId }).sort({ createdAt: -1 });

    if (!assessments.length) {
      return res.status(404).json({ message: 'No assessments found for this user.' });
    }

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments.' });
  }
});

app.use('/api/aichat', chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
