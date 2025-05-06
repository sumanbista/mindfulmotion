// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const communityRoutes = require('./routes/communityRoutes');
// const assessmentRoutes = require('./routes/assessmentRoutes');
const assessmentAnalysisRoutes = require('./routes/assessmentAnalysis');
const UserAssessment = require('./models/UserAssessment');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middlewares
app.use(cors());
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
    const response = await fetch('https://zenquotes.io/api/quotes/[your_key]');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quote', error });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
console.log('→ mounting communityRoutes') 
app.use('/api/community', communityRoutes);


// Assessment Route (for collecting personality and mental health data)
// app.use('/api/assessment', assessmentRoutes);  // Assuming the assessmentRoutes are handled in a separate file
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
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Error fetching assessments.' });
  }
});

app.use('/api/aichat', chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log('Available categories:', Object.keys(categoryVideos));
  // console.log('Available endpoints:');
  // console.log('- GET /api/videos/:category');
  // console.log('- GET /api/embeds');
});
