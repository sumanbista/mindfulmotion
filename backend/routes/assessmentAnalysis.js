const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const UserAssessment = require('../models/UserAssessment');
const { Groq } = require('groq-sdk'); 

// Initialize Groq SDK client
const groq = new Groq({
    apiKey: process.env.GROQCLOUD_API_KEY, 
});

router.use(authenticateUser);


router.post('/analyze', async (req, res) => {
    try {
        const { mentalHealth, wellness } = req.body;

        // Validate input
        const validateNumericRange = (obj, max) =>
            Object.values(obj).every(val => typeof val === 'number' && val >= 0 && val <= max);

        if (!validateNumericRange(mentalHealth, 4) || !validateNumericRange(wellness, 4)) {
            return res.status(400).json({ message: 'All values must be between 0 and 4.' });
        }

        const userId = req.user.uid;
        if (!userId) return res.status(400).json({ message: 'User ID is required.' });

        // Save to DB
        const newAssessment = new UserAssessment({ userId, mentalHealth, wellness });
        await newAssessment.save();

        // Normalization: score out of 10
        const normalize = (value, max) => (value / max) * 10;

        const scoreBreakdown = {
            depression: normalize(mentalHealth.depression, 3),
            anxiety: normalize(mentalHealth.anxiety, 3),
            stress: normalize(mentalHealth.stress, 4),
            mood: normalize(wellness.mood, 4),
            sleep: normalize(wellness.sleep, 4),
            physicalActivity: normalize(wellness.physicalActivity, 4),
            socialInteraction: normalize(wellness.socialInteraction, 4),
            selfCare: normalize(wellness.selfCare, 4),
            stressManagement: normalize(wellness.stressManagement, 4)
        };

        const allScores = Object.values(scoreBreakdown);
        const overallScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

        // Prompt for Groq
        const prompt = `
You are a licensed wellness coach. Analyze the user's self-assessment and provide guidance.
Their average score is ${overallScore.toFixed(1)} out of 10.

Score breakdown:
${Object.entries(scoreBreakdown).map(([k, v]) => `- ${k}: ${v.toFixed(1)}/10`).join('\n')}

Give a JSON object with:
{
  "overallScore": <number>,
  "insights": "<your analysis here>",
  "recommendations": ["<tip 1>", "<tip 2>", ...]
}
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 1,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        const rawContent = chatCompletion?.choices?.[0]?.message?.content;
        let structuredResponse;

        try {
            structuredResponse = JSON.parse(rawContent);
        } catch {
            const jsonStart = rawContent.indexOf('{');
            const jsonEnd = rawContent.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                try {
                    structuredResponse = JSON.parse(rawContent.substring(jsonStart, jsonEnd + 1));
                } catch (err) {
                    return res.status(500).json({ message: 'Invalid JSON from LLM', rawContent });
                }
            } else {
                return res.status(500).json({ message: 'No valid JSON found in LLM response', rawContent });
            }
        }

        // Ensure score fallback
        if (!structuredResponse.overallScore) {
            structuredResponse.overallScore = parseFloat(overallScore.toFixed(1));
        }

        // Include score breakdown for frontend display
        structuredResponse.scoreBreakdown = scoreBreakdown;

        res.json(structuredResponse);
    } catch (error) {
        console.error('Error analyzing assessment:', error);
        res.status(500).json({ message: 'Server error analyzing assessment.', error });
    }
});

module.exports = router;
