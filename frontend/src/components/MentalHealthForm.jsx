import React from 'react';

const MentalHealthForm = ({ formData, handleChange }) => {
  const questions = [
    {
      name: 'mentalHealth.depression',
      text: 'Over the past two weeks, how often have you felt little interest or pleasure in doing things?',
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      name: 'mentalHealth.anxiety',
      text: 'Over the past two weeks, how often have you felt nervous, anxious, or on edge?',
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      name: 'mentalHealth.stress',
      text: 'On a scale of 0 to 4, how stressed have you felt in the past week? (0 - Not at all, 4 - Extremely)',
      options: [
        { label: "0 - Not at all", value: 0 },
        { label: "1 - Slightly", value: 1 },
        { label: "2 - Moderately", value: 2 },
        { label: "3 - Very", value: 3 },
        { label: "4 - Extremely", value: 4 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-teal-700 mb-6">Mental Health Check</h3>

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
                            checked={Number(formData.mentalHealth[q.name.split('.')[1]]) === option.value}
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

export default MentalHealthForm;