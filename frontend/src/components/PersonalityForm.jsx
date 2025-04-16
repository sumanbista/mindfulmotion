import React from 'react';

const PersonalityForm = ({ formData, handleChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Personality Assessment</h3>
      {Object.keys(formData.personality).map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
          <input
            type="number"
            min="0"
            max="10"
            name={`personality.${key}`}
            value={formData.personality[key]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
    </div>
  );
};

export default PersonalityForm;
