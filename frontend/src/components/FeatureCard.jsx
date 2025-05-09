// src/components/FeatureCard.jsx
import React from 'react';

// A simple, modern Feature Card component with themed styling
function FeatureCard({ image, title, subtitle, buttonText, onButtonClick, progress }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col md:flex-row items-center border border-gray-200"> {/* Themed container with shadow and border */}
      {/* Image */}
      {image && (
        <div className="w-full md:w-1/2 h-40 overflow-hidden"> {/* Added overflow hidden */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-md mb-4 md:mb-0" 
          />
        </div>
      )}

      {/* Content (Title, Subtitle, Progress, Button) */}
      <div className={`w-full ${image ? 'md:w-1/2 pl-0 md:pl-6' : ''} flex flex-col items-center ${image ? 'md:items-start' : 'md:items-center'}`}> {/* Conditional padding/alignment */}
        <h2 className="text-xl font-semibold mb-2 text-center md:text-left text-teal-700">{title}</h2> {/* Themed title */}
        {subtitle && <p className="text-gray-600 text-center md:text-left mb-4 text-base">{subtitle}</p>} {/* Themed subtitle */}

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4"> {/* Slightly thinner progress bar */}
            <div
              className="bg-emerald-600 h-2.5 rounded-full" 
              style={{ width: `${progress > 100 ? 100 : progress < 0 ? 0 : progress}%` }} // Ensure progress is within [0, 100]
            ></div>
          </div>
        )}

        {/* Button */}
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="mt-2 px-6 py-2 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-200"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default FeatureCard;