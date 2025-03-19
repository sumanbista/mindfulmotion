// src/components/CardItem.jsx
import React from 'react'

export default function CardItem({
  image,
  title,
  subtitle,
  progress,
  buttonText,
  buttonVariant,
  buttonAction,
  children,
}) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Image on Top (optional) */}
      {image && (
        <img
          src={image}
          alt={title}
          className="h-40 w-full object-cover"
        />
      )}

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Title, Subtitle & Children */}
        <div>
          {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-600 mb-2">{subtitle}</p>}
          {children && <div>{children}</div>}
        </div>

        {/* Progress Bar (optional) */}
        {typeof progress === 'number' && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Button (optional) */}
        {buttonText && (
          <button
            onClick={buttonAction}
            className={`mt-4 px-4 py-2 rounded transition-colors ${
              buttonVariant === 'contained'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}
