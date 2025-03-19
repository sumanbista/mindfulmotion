/* -------------------------
   index.js (Express Server)
-------------------------- */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// Hardcoded embed list
const embedList = [
  `<iframe width="560" height="315"
    src="https://www.youtube.com/embed/YRJ6xoiRcpQ?si=iochuSHWtjxhWA1L"
    title="YouTube video player" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
   </iframe>`,
  `<iframe width="560" height="315"
    src="https://www.youtube.com/embed/gQ9vs3ZKWjE?si=okpniq6f_9-nRO0x"
    title="YouTube video player" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
   </iframe>`,
  `<iframe width="560" height="315"
    src="https://www.youtube.com/embed/BLT9bgx930E?si=y6kjd0puoup2eHE4"
    title="YouTube video player" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
   </iframe>`
];

const videoIds = ["YRJ6xoiRcpQ", "gQ9vs3ZKWjE", "BLT9bgx930E"];

// Routes
app.get('/', (req, res) => {
  res.send("Backend is running! Go to /api/embeds to check");
});

app.get('/api/embeds', (req, res) => {
  res.json(videoIds);
});

app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
