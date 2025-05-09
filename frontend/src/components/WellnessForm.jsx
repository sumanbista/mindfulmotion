import React from 'react';

const WellnessForm = ({ formData, handleChange }) => {
    const questions = [
        {
          name: 'wellness.sleep',
          text: 'How well do you feel rested when you wake up?',
          options: [
             { label: "4 - Completely rested -  I always wake up feeling fully refreshed.", value: 4 },
             { label: "3 - Mostly rested  I usually feel rested upon waking.", value: 3 },
             { label: "2 - Moderately rested –I sometimes feel okay when I wake up.", value: 2 },
             { label: "1 - Slightly rested - I rarely feel rested when I wake up.", value: 1 },
             { label: "0 - Not at all rested – I never feel rested when I wake up.", value: 0 },
          ],
        },
         {
          name: 'wellness.physicalActivity',
          text: 'How often do you engage in physical activity (e.g., walking, exercise)?',
          options: [
            { label: "0 - Never – I do not engage in any physical activity.", value: 0 },
            { label: "1 - Rarely – I engage in physical activity less than once a week.", value: 1 },
            { label: "2 - Occasionally – I engage in physical activity about 1–2 times per week.", value: 2 },
            { label: "3 - Regularly – I engage in physical activity around 3–4 times per week.", value: 3 },
            { label: "4 - Frequently – I exercise or move actively 5 or more times per week.", value: 4 },
          ],
        },
         {
          name: 'wellness.socialInteraction',
          text: 'How often do you engage in social interactions?',
          options: [
            { label: "0 - Never – I rarely interact with others.", value: 0 },
            { label: "1 - Rarely – I have minimal social interaction.", value: 1 },
            { label: "2 - Occasionally – I interact with others sometimes.", value: 2 },
            { label: "3 - Frequently – I regularly engage in social interactions.", value: 3 },
            { label: "4 - Very Frequently – I'm highly socially active and feel well-connected.", value: 4 },
          ],
        },
         {
          name: 'wellness.selfCare',
          text: 'How often do you take time to care for yourself (e.g., hobbies, relaxation)?',
          options: [
             { label: "0 - Never – I never take time for self-care.", value: 0 },
             { label: "1 - Rarely – I rarely set aside time for self-care.", value: 1 },
             { label: "2 - Sometimes – I take time for self-care occasionally.", value: 2 },
             { label: "3 - Often – I regularly make time for self-care activities.", value: 3 },
             { label: "4 - Always – I consistently prioritize self-care every day.", value: 4 },
          ],
        },
         {
          name: 'wellness.stressManagement',
          text: 'How well do you manage stress?',
          options: [
             { label: "4 - Extremely Effective – I manage stress exceptionally well and remain calm under pressure.", value: 4 },
             { label: "3 - Very Effective – I have solid stress management strategies that mostly work.", value: 3 },
             { label: "2 - Moderately Effective – I handle stress reasonably well most of the time.", value: 2 },
             { label: "1 - Slightly Effective – I sometimes find strategies that help but mostly struggle.", value: 1 },
             { label: "0 - Not Effective At All – I struggle significantly to manage my stress.", value: 0 },
          ],
        },
         {
          name: 'wellness.mood',
          text: 'How would you rate your overall mood?',
          options: [
             { label: "0 - Very Negative – I feel extremely down or depressed.", value: 0 },
             { label: "1 - Somewhat Negative – My mood is mostly negative.", value: 1 },
             { label: "2 - Neutral – I'm feeling neither positive nor negative.", value: 2 },
             { label: "3 - Somewhat Positive – I generally feel good, with some ups and downs.", value: 3 },
             { label: "4 - Very Positive – I feel upbeat and happy throughout the day.", value: 4 },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-teal-700 mb-6">Wellness Check</h3>

      {questions.map((q, index) => (
         <div key={q.name} className={`p-5 border border-gray-200 rounded-lg bg-white ${index < questions.length -1 ? 'mb-6' : ''}`}>
            <p className="text-lg font-medium text-gray-700 mb-4">{q.text}</p>
            <div className="flex flex-col space-y-3">
                {q.options.map(option => (
                    <label key={option.value} className="inline-flex items-center cursor-pointer text-gray-800 hover:text-teal-600 transition duration-150 ease-in-out">
                        <input
                            type="radio"
                            name={q.name}
                            value={option.value}
                            checked={Number(formData.wellness[q.name.split('.')[1]]) === option.value}
                            onChange={handleChange}
                            className="form-radio h-5 w-5 text-teal-600 border-gray-300 focus:ring-teal-500 transition duration-150 ease-in-out"
                        />
                        <span className="ml-3 text-base">{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
      ))}
    </div>
  );
};

export default WellnessForm;