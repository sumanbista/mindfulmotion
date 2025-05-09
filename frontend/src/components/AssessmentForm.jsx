import React, { useState, useEffect } from 'react';
import MentalHealthForm from './MentalHealthForm';
import WellnessForm from './WellnessForm';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { auth } from '../../firebase/config';
import { useToast } from '../contexts/ToastContext';

const AssessmentForm = () => {
  const { showSuccess, showError } = useToast(); // Use toast context

  const [formData, setFormData] = useState({
    mentalHealth: {
      depression: null, // Use null initially to indicate not answered
      anxiety: null,
      stress: null,
    },
    wellness: {
      mood: null,
      sleep: null,
      physicalActivity: null,
      socialInteraction: null,
      selfCare: null,
      stressManagement: null,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null); // null means show form, non-null means show results
  const [error, setError] = useState(null); // To display submission errors
  const navigate = useNavigate();

  const totalSteps = 2; // Mental Health (1) + Wellness (2)

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [category, field] = name.split('.');

    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value), // Ensure value is a number
      },
    }));
  };

  // Optional: Basic validation check for the current step
  const isStepValid = () => {
      if (currentStep === 1) {
          // Check if all mental health questions are answered
          const { depression, anxiety, stress } = formData.mentalHealth;
          return depression !== null && anxiety !== null && stress !== null;
      }
      if (currentStep === 2) {
           // Check if all wellness questions are answered
           const { mood, sleep, physicalActivity, socialInteraction, selfCare, stressManagement } = formData.wellness;
           return mood !== null && sleep !== null && physicalActivity !== null && socialInteraction !== null && selfCare !== null && stressManagement !== null;
      }
      return true; // Should not happen if steps are 1 and 2
  };


  const handleNextStep = () => {
      if (!isStepValid()) {
          showError('Please answer all questions before proceeding.'); // Show error toast
          return;
      }
      setError(null); // Clear previous errors
      setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setError(null); // Clear previous errors
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStepValid()) {
        showError('Please answer all questions before submitting.'); // Show error toast
        return;
    }

    setIsSubmitting(true);
    setError(null); // Clear previous errors

    try {
      const token = await auth.currentUser.getIdToken();
      console.log('Token being sent:', token); // Debug log to verify token
    
      if (!token) {
        showError('Please log in.'); // Show error toast
        navigate('/login');
        return;
      }

      console.log('Token being sent:', token); // Debug log to verify token

      const response = await fetch('http://localhost:5000/api/assessment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAssessmentResult(data); // Set result to show results view
        showSuccess('Assessment submitted successfully!'); // Show success toast
      } else {
         // Handle specific backend errors if needed
         // Display error message on the form
         setError(data.message || 'An error occurred during submission.');
         showError(data.message || 'An error occurred during submission.'); // Show error toast
         // Optionally stay on the submit step or show a generic error page
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setError('An error occurred while submitting the assessment.');
      showError('An error occurred while submitting the assessment.'); // Show error toast
      // Optionally stay on the submit step or show a generic error page
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = auth.currentUser.getIdToken();
    if (!token) {
      setError('You are not authorized to access this page. Please sign up or log in.');
      return;
    }

    // Additional logic if needed for token validation
  }, []);

  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
      >
        Go to Login
      </button>
    </div>
  );

  // --- Render Logic ---
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl w-full">
      {/* Conditional Rendering: Show Results OR Form */}
      {assessmentResult ? (
        // --- Assessment Result Display ---
        <div className="assessment-results">
          <h3 className="text-2xl font-bold mb-4 text-teal-800 text-center">Your Wellness Summary</h3>
          <div className="mt-6 p-6 bg-emerald-50 rounded-lg shadow-inner border border-emerald-200 text-gray-800 space-y-4">
               {/* Basic Result Info */}
                <p>
                   <strong className="font-semibold text-teal-700">Overall Wellness Score:</strong> <span className="text-lg">{assessmentResult.overallScore}</span>
                </p>

               {/* Score Breakdown */}
                {assessmentResult.scoreBreakdown && (
                  <div>
                      <strong className="font-semibold text-teal-700">Score Breakdown:</strong>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          {Object.entries(assessmentResult.scoreBreakdown).map(([category, score]) => (
                               <li key={category} className="text-sm">
                                  <span className="capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>: {score}
                               </li>
                          ))}
                      </ul>
                  </div>
                )}

               {/* Insights */}
                <div>
                    <strong className="font-semibold text-teal-700">Insights:</strong>
                    <p className="mt-2">{assessmentResult.insights || 'No specific insights available at this time.'}</p>
                </div>

               {/* Recommendations */}
                <div>
                    <strong className="font-semibold text-teal-700">Recommendations:</strong>
                    {assessmentResult.recommendations && assessmentResult.recommendations.length > 0 ? (
                         <ul className="list-disc pl-6 mt-2 space-y-2">
                         {assessmentResult.recommendations.map((rec, index) => (
                             <li key={index}>{rec}</li>
                         ))}
                         </ul>
                    ) : (
                         <p className="mt-2">No specific recommendations available at this time.</p>
                    )}
                </div>

          </div>
           {/* Call to Action Button */}
           <div className="text-center mt-8">
               {/* Example: Button to navigate to a dashboard or resources page */}
               <button
                   onClick={() => navigate('/')} // Adjust path as needed
                   className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
               >
                   Go To Home
               </button>
           </div>
        </div>
      ) : (
        // --- Assessment Form Display ---
        <div className="assessment-form">
            <h2 className="text-3xl font-semibold text-center mb-8 text-teal-800">
                Your Wellness Check-in
            </h2>

            {/* Step Indicator */}
            <div className="text-center text-gray-600 mb-6 text-lg font-medium">
                Step {currentStep} of {totalSteps}
            </div>

             {/* Error Message */}
            {error && (
                 <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200 text-center">
                     {error}
                 </div>
            )}


            {/* Step-wise Form Display */}
            <div className="form-step">
                {currentStep === 1 && (
                <MentalHealthForm formData={formData} handleChange={handleChange} />
                )}
                {currentStep === 2 && (
                <WellnessForm formData={formData} handleChange={handleChange} />
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                <button
                    onClick={handlePreviousStep}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting} // Disable navigation while submitting
                >
                    Previous
                </button>
                )}
                 {/* Spacer div to push Next/Submit to the right when there's no Previous button */}
                {currentStep === 1 && <div></div>}


                {currentStep < totalSteps ? (
                <button
                    onClick={handleNextStep}
                     className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={isSubmitting} // Disable navigation while submitting
                >
                    Next
                </button>
                ) : (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;