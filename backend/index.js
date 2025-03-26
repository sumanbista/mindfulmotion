// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const communityRoutes = require('./routes/communityRoutes');

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

// Update video list to be organized by category
const categoryVideos = {
  relax: [
    "ZToicYcHIOU", // Relaxing Music with Nature Sounds
    "WZKW2Hq2fks", // Calming Sleep Music
    "lFcSrYw-ARY"  // Deep Relaxation Meditation
  ],
  focus: [
    "5qap5aO4i9A", // Lofi beats to study/work
    "dQCZob-0JAw", // Focus Music for Work and Studying
    "5GSMTqBMPHM"  // Concentration Music
  ],
  sleep: [
    "2K4T9HmEhWE",
    "yu-YmyvNtb8",
    "Sh-YrLYC7p8"  // Deep Sleep Music
  ],
  energy: [
    "C5L8Z3qA1DA", 
    "Ei0QHQbOOFU",
    "3RxXiFgkxGc" 
  ],
  mindfulness: [
    "Rx5X-fo_fEI", // Mindful Breathing Practice
    "MIr3RsUWrdo", // Guided Mindfulness Meditation 
    "caq8XpjAswo"  // Body Scan Meditation
  ]
};

// Routes
app.get('/api/videos/:category', (req, res) => {
  try {
    const category = req.params.category;
    console.log(`Received request for category: ${category}`);
    
    if (categoryVideos[category]) {
      console.log(`Found ${categoryVideos[category].length} videos for ${category}:`, categoryVideos[category]);
      return res.json(categoryVideos[category]);
    }
    
    console.log(`Category ${category} not found, sending all videos`);
    const allVideos = Object.values(categoryVideos).flat();
    res.json(allVideos);
  } catch (error) {
    console.error(`Error in /api/videos/${req.params.category}:`, error);
    res.status(500).json({ error: error.message });
  }
});
// Keep the original endpoint for backward compatibility
app.get('/api/embeds', (req, res) => {
  try {
    const allVideos = Object.values(categoryVideos).flat();
    res.json(allVideos);
  } catch (error) {
    console.error('Error in /api/embeds:', error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

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
app.use('/api/community', communityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log('Available categories:', Object.keys(categoryVideos));
  // console.log('Available endpoints:');
  // console.log('- GET /api/videos/:category');
  // console.log('- GET /api/embeds');
});
