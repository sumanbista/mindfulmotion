import React from 'react';

const WellnessForm = ({ formData, handleChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-2xl font-bold mb-6">Wellness Assessment</h3>
      
      {/* Sleep */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How well do you feel rested when you wake up?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Completely rested – I always wake up feeling fully refreshed.", value: 4 },
            { label: "Mostly rested – I usually feel rested upon waking.", value: 3 },
            { label: "Moderately rested – I sometimes feel okay when I wake up.", value: 2 },
            { label: " Slightly rested – I rarely feel rested when I wake up.", value: 1 },
            { label: " Not at all rested – I never feel rested when I wake up.", value: 0 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="wellness.sleep" 
                value={option.value}
                checked={Number(formData.wellness.sleep) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Physical Activity */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How often do you engage in physical activity (e.g., walking, exercise)?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Never – I do not engage in any physical activity.", value: 0 },
            { label: "Rarely – I engage in physical activity less than once a week.", value: 1 },
            { label: "Occasionally – I engage in physical activity about 1–2 times per week.", value: 2 },
            { label: "Regularly – I engage in physical activity around 3–4 times per week.", value: 3 },
            { label: "Frequently – I exercise or move actively 5 or more times per week.", value: 4 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="wellness.physicalActivity" 
                value={option.value}
                checked={Number(formData.wellness.physicalActivity) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Self-Care */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How often do you take time to care for yourself (e.g., hobbies, relaxation)?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Never – I never take time for self-care.", value: 0 },
            { label: "Rarely – I rarely set aside time for self-care.", value: 1 },
            { label: "Sometimes – I take time for self-care occasionally.", value: 2 },
            { label: "Often – I regularly make time for self-care activities.", value: 3 },
            { label: "Always – I consistently prioritize self-care every day.", value: 4 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="wellness.selfCare" 
                value={option.value}
                checked={Number(formData.wellness.selfCare) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stress Management */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How well do you manage stress?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Extremely Effective – I manage stress exceptionally well and remain calm under pressure.", value: 4 },
            { label: "Very Effective – I have solid stress management strategies that mostly work.", value: 3 },
            { label: "Moderately Effective – I handle stress reasonably well most of the time.", value: 2 },
            { label: "Slightly Effective – I sometimes find strategies that help but mostly struggle.", value: 1 },
            { label: " Not Effective At All – I struggle significantly to manage my stress.", value: 0 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="wellness.stressManagement" 
                value={option.value}
                checked={Number(formData.wellness.stressManagement) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Social Interaction */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How often do you engage in social interactions?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Never – I rarely interact with others.", value: 0 },
            { label: "Rarely – I have minimal social interaction.", value: 1 },
            { label: "Occasionally – I interact with others sometimes.", value: 2 },
            { label: "Frequently – I regularly engage in social interactions.", value: 3 },
            { label: "Very Frequently – I'm highly socially active and feel well-connected.", value: 4 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="wellness.socialInteraction" 
                value={option.value}
                checked={Number(formData.wellness.socialInteraction) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Overall Mood */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How would you rate your overall mood?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Very Negative – I feel extremely down or depressed.", value: 0 },
            { label: "Somewhat Negative – My mood is mostly negative.", value: 1 },
            { label: "Neutral – I'm feeling neither positive nor negative.", value: 2 },
            { label: "Somewhat Positive – I generally feel good, with some ups and downs.", value: 3 },
            { label: "Very Positive – I feel upbeat and happy throughout the day.", value: 4 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="wellness.mood" 
                value={option.value}
                checked={Number(formData.wellness.mood) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WellnessForm;
