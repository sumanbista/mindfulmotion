import React from 'react';

const MentalHealthForm = ({ formData, handleChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Mental Health Assessment</h3>

      {/* Depression */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          Over the past two weeks, how often have you felt little interest or pleasure in doing things?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Not at all", value: 0 },
            { label: "Several days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Nearly every day", value: 3 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="mentalHealth.depression" 
                value={option.value}
                checked={Number(formData.mentalHealth.depression) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Anxiety */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          How often have you felt nervous, anxious, or on edge?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Not at all", value: 0 },
            { label: "Several days", value: 1 },
            { label: "More than half the days", value: 2 },
            { label: "Nearly every day", value: 3 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="mentalHealth.anxiety" 
                value={option.value}
                checked={Number(formData.mentalHealth.anxiety) === option.value}
                onChange={handleChange}
                className="form-radio text-blue-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stress */}
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          On a scale of 0 to 4, how stressed have you felt in the past week?
        </p>
        <div className="flex flex-col">
          {[
            { label: "Not at all", value: 0 },
            { label: "Slightly", value: 1 },
            { label: "Moderately", value: 2 },
            { label: "Very", value: 3 },
            { label: "Extremely", value: 4 },
          ].map(option => (
            <label key={option.value} className="inline-flex items-center mb-1">
              <input 
                type="radio" 
                name="mentalHealth.stress" 
                value={option.value}
                checked={Number(formData.mentalHealth.stress) === option.value}
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

export default MentalHealthForm;
