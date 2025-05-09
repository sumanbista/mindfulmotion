const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const UserAssessment = require('../models/UserAssessment');
const { Groq } = require('groq-sdk'); // Make sure groq-sdk is installed

// Initialize Groq SDK client
const groq = new Groq({
    apiKey: process.env.GROQCLOUD_API_KEY, // Pass your API key if required by the SDK
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

// router.post('/analyze', async (req, res) => {
//     try {
//         const { mentalHealth, wellness } = req.body;

//         // Validate that all numeric values are between 0 and 10
//         const validateNumericRange = (obj) =>
//             Object.values(obj).every(val => val >= 0 && val <= 10);
//         if (!validateNumericRange(mentalHealth) || !validateNumericRange(wellness)) {
//             return res.status(400).json({ message: 'All values must be between 0 and 10.' });
//         }

//         const userId = req.user.uid; // Extract userId from the decoded Firebase token
//         console.log('Extracted userId:', userId);

//         if (!userId) {
//             return res.status(400).json({ message: 'User ID is required.' });
//         }

//         // Save the assessment data to the database (optional before analysis)
//         const newAssessment = new UserAssessment({
//             userId, // Include userId in the document
//             mentalHealth,
//             wellness,
//         });
//         await newAssessment.save();

//         // Construct a prompt from the responses
//         const prompt = `
//     Your role is to serve as a mental health and wellness expert. 
//     Based on the user’s responses to a series of questions about their emotional, physical, and social well-being, 
//     provide a detailed, empathetic response that reflects research-backed recommendations. 
//     Focus on identifying key issues (e.g., stress, anxiety, sleep problems) and offering strategies tailored to the user's specific circumstances. 
//     The recommendations should be informed by the latest psychological research, including studies on mindfulness, physical activity, social engagement, and coping strategies. 
//     Your goal is to provide expert-level, actionable advice that supports the user in improving their mental health and overall well-being.
    
//     Mental Health:

//     - Depression: "Over the past two weeks, how often have you felt little interest or pleasure in doing things?
//         Options:

//         0: Not at all

//         1: Several days

//         2: More than half the days

//         3: Nearly every day" : ${mentalHealth.depression}
//       - Anxiety: "How often have you felt nervous, anxious, or on edge? Options:

//         0: Not at all

//         1: Mildly

//         2: Moderately

//         3: Extremely" : ${mentalHealth.anxiety}
//       - Stress: " how stressed have you felt in the past week? 0: Not stressed at all

//         1: Slightly stressed

//         2: Moderately stressed

//         3: Very stressed

//         4: Extremely stressed" : ${mentalHealth.stress}
    
//     Wellness:
//       - Mood: "Have you noticed any significant changes in your mood recently?
//             0: Very Negative – I feel extremely down or depressed.

//             1: Somewhat Negative – My mood is mostly negative.

//             2: Neutral – I'm feeling neither positive nor negative.

//             3: Somewhat Positive – I generally feel good, with some ups and downs.

//             4: Very Positive – I feel upbeat and happy throughout the day." : ${wellness.mood}
//       - Sleep: "How well do you feel rested when you wake up?  
//             0: Not at all rested – I never feel rested when I wake up.

//             1: Slightly rested – I rarely feel rested when I wake up.

//             2: Moderately rested – I sometimes feel okay when I wake up.

//             3: Mostly rested – I usually feel rested upon waking.

//             4: Completely rested – I always wake up feeling fully refreshed." : ${wellness.sleep}
//       - Physical Activity: "How often do you engage in physical activity (e.g., walking, exercise)?  
//             0: Never – I do not engage in any physical activity.

//             1: Rarely – I engage in physical activity less than once a week.

//             2: Occasionally – I engage in physical activity about 1–2 times per week.

//             3: Regularly – I engage in physical activity around 3–4 times per week.

//             4: Frequently – I exercise or move actively 5 or more times per week." : ${wellness.physicalActivity}
//       - Social Interaction: "How often do you engage in social activities with friends, family, or colleagues?
//             0: Never – I rarely interact with others.

//             1: Rarely – I have minimal social interaction.

//             2: Occasionally – I interact with others sometimes.

//             3: Frequently – I regularly engage in social interactions.

//             4: Very Frequently – I'm highly socially active and feel well-connected." : ${wellness.socialInteraction}
//       - Self-Care: "How often do you take time to care for yourself (e.g., hobbies, relaxation)? 
//             0: Never – I never take time for self-care.

//             1: Rarely – I rarely set aside time for self-care.

//             2: Sometimes – I take time for self-care occasionally.

//             3: Often – I regularly make time for self-care activities.

//             4: Always – I consistently prioritize self-care every day." : ${wellness.selfCare}
//       - Stress Management: "Have you been using any specific techniques to manage stress (e.g., meditation, exercise)?
//             0: Not Effective At All – I struggle significantly to manage my stress.

//             1: Slightly Effective – I sometimes find strategies that help but mostly struggle.

//             2: Moderately Effective – I handle stress reasonably well most of the time.

//             3: Very Effective – I have solid stress management strategies that mostly work.

//             4: Extremely Effective – I manage stress exceptionally well and remain calm under pressure." : ${wellness.stressManagement}
    
    
    
//     Please provide your analysis as a JSON object with the following keys:
//     {
//       "overallScore": <number> this is average score out of 10,
//       "insights": "<string>",
//       "recommendations": ["<string>", ...]
//     }
//    `;

//         // Call the Groqcloud LLM API using Groq SDK
//         // Adjust parameters as needed according to the Groqcloud documentation
//         const chatCompletion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "user",
//                     content: prompt
//                 }
//             ],
//             model: "meta-llama/llama-4-scout-17b-16e-instruct",
//             temperature: 1,
//             max_completion_tokens: 1024,
//             top_p: 1,
//             stream: false, // We are not streaming in this example
//             stop: null
//         });

//         // Return the API response back to the frontend
//         // Extract the content from the first choice
//         const rawContent = chatCompletion?.choices?.[0]?.message?.content;
//         let structuredResponse;

//         try {
//             // Try parsing the raw content as JSON directly
//             structuredResponse = JSON.parse(rawContent);
//         } catch (parseError) {
//             console.error("Error parsing LLM response JSON:", parseError);
//             // Attempt to extract the valid JSON substring from the response
//             const jsonStart = rawContent.indexOf('{');
//             const jsonEnd = rawContent.lastIndexOf('}');
//             if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
//                 const jsonSubstring = rawContent.substring(jsonStart, jsonEnd + 1);
//                 try {
//                     structuredResponse = JSON.parse(jsonSubstring);
//                 } catch (extractionError) {
//                     console.error("Error parsing extracted JSON:", extractionError);
//                     return res.status(500).json({ message: 'Error parsing LLM response JSON', rawContent });
//                 }
//             } else {
//                 return res.status(500).json({ message: 'LLM response did not contain valid JSON', rawContent });
//             }
//         }

//         // Return the structured analysis result
//         res.json(structuredResponse);

//     } catch (error) {
//         console.error('Error analyzing assessment:', error);
//         res.status(500).json({ message: 'Error analyzing assessment', error });
//     }

    // For demonstration, we simulate the output:
    //     const llmData = {
    //         overallScore: 7.2,
    //         insights: "Your responses suggest that you are managing stress moderately well, but your sleep and social interaction scores indicate there is room for improvement. You might benefit from incorporating a bedtime relaxation routine and engaging in more social activities.",
    //         recommendations: [
    //             "Try a guided meditation focusing on relaxation at bedtime.",
    //             "Consider scheduling regular social outings to enhance your social interactions.",
    //             "Monitor sleep patterns closely and adjust your sleep environment to improve sleep quality."
    //         ]
    //     };

    //     // Return the analysis result back to the frontend
    //     res.json(llmData);
    // } catch (error) {
    //     console.error('Error analyzing assessment:', error);
    //     res.status(500).json({ message: 'Error analyzing assessment', error });
    // }

