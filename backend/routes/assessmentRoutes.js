const express = require('express');
const router = express.Router();
const UserAssessment = require('../models/UserAssessment');
const authenticateUser = require('../middleware/authMiddleware');

router.use(authenticateUser);

// Route to save user assessment
router.post('/', async (req, res) => {
    try {
        const { personality, mentalHealth, wellness } = req.body;
        
        // Validation: Check that each personality trait is a number between 0 and 10
        const personalityValid = Object.values(personality).every(val => val >= 0 && val <= 10);
        const mentalHealthValid = Object.values(mentalHealth).every(val => val >= 0 && val <= 10);
        const wellnessValid = Object.values(wellness).every(val => val >= 0 && val <= 10);
    
        if (!personalityValid || !mentalHealthValid || !wellnessValid) {
          return res.status(400).json({ message: 'All values must be between 0 and 10' });
        }

    // Create a new assessment entry
    const newAssessment = new UserAssessment({
      userId,
      personality,
      mentalHealth,
      wellness,
    });

    // Save the assessment to the database
    await newAssessment.save();

    res.status(200).json({ message: 'Assessment saved successfully!' });
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({ message: 'Error saving assessment.' });
  }
});


// Optional: Get past assessments for the authenticated user
router.get('/', async (req, res) => {
    try {
      const assessments = await UserAssessment.find({ userId: req.user._id }).sort({ createdAt: -1 });
      
      if (assessments.length === 0) {
        return res.status(404).json({ message: 'No assessments found.' });
      }
  
      res.json(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Error fetching assessments.' });
    }
  });


  // Route to get past user assessments
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Add authorization check to ensure users can only see their own assessments
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to access these assessments' });
    }

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

module.exports = router;
