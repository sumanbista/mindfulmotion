// import React, { useState } from 'react';
// import PersonalityForm from './PersonalityForm';
// import MentalHealthForm from './MentalHealthForm';
// import WellnessForm from './WellnessForm';
// import { jwtDecode } from 'jwt-decode';

// import { useNavigate } from 'react-router-dom';

// const AssessmentForm = () => {
//   const [formData, setFormData] = useState({
//     personality: {
//       openness: 0,
//       conscientiousness: 0,
//       extraversion: 0,
//       agreeableness: 0,
//       neuroticism: 0,
//     },
//     mentalHealth: {
//       depression: 0,
//       anxiety: 0,
//       stress: 0,
//     },
//     wellness: {
//       mood: 0,
//       sleep: 0,
//       physicalActivity: 0,
//       socialInteraction: 0,
//       selfCare: 0,
//       stressManagement: 0,
//     },
//   });

//   const [currentStep, setCurrentStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const [category, field] = name.split('.');

//     setFormData((prev) => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [field]: value,
//       },
//     }));
//   };

//   const handleNextStep = () => {
//     setCurrentStep((prevStep) => prevStep + 1);
//   };

//   const handlePreviousStep = () => {
//     setCurrentStep((prevStep) => prevStep - 1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
//       if (!token) {
//         alert('No token found. Please log in again.');
//         return;
//       }

//       // Decode the JWT token to get user information
//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.userId; // Assuming the userId is stored in the JWT payload

//       const response = await fetch('http://localhost:5000/api/assessment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Send JWT token in header
//         },
//         body: JSON.stringify({
//           userId,
//           personality: formData.personality,
//           mentalHealth: formData.mentalHealth,
//           wellness: formData.wellness,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert('Assessment saved successfully!');
//         navigate('/home');
//       } else {
//         alert('Error saving assessment: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Mental Health & Personality Assessment</h2>

//       {/* Step-wise Form Display */}
//       {currentStep === 1 && (
//         <PersonalityForm formData={formData} handleChange={handleChange} />
//       )}
//       {currentStep === 2 && (
//         <MentalHealthForm formData={formData} handleChange={handleChange} />
//       )}
//       {currentStep === 3 && (
//         <WellnessForm formData={formData} handleChange={handleChange} />
//       )}

//       {/* Navigation Buttons */}
//       <div className="flex justify-between mt-4">
//         {currentStep > 1 && (
//           <button
//             onClick={handlePreviousStep}
//             className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//           >
//             Previous
//           </button>
//         )}

//         {currentStep < 3 ? (
//           <button
//             onClick={handleNextStep}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Submit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AssessmentForm;


import React, { useState } from 'react';
import MentalHealthForm from './MentalHealthForm';
import WellnessForm from './WellnessForm';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AssessmentForm = () => {
  const [formData, setFormData] = useState({
    mentalHealth: {
      depression: 0,
      anxiety: 0,
      stress: 0,
    },
    wellness: {
      mood: 0,
      sleep: 0,
      physicalActivity: 0,
      socialInteraction: 0,
      selfCare: 0,
      stressManagement: 0,
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [category, field] = name.split('.');
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value),
      },
    }));
  };

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePreviousStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in.');
        navigate('/login');
        return;
      }
      // Decode token (to use if needed)
      const decodedToken = jwtDecode(token);
      // Note: We assume our backend uses authentication middleware 
      // so it extracts the real userId from the token.
      const response = await fetch('http://localhost:5000/api/assessment/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mentalHealth: formData.mentalHealth,
          wellness: formData.wellness,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAssessmentResult(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Mental Health & Wellness Assessment</h2>

      {/* Step-wise Form Display */}
      {currentStep === 1 && (
        <MentalHealthForm formData={formData} handleChange={handleChange} />
      )}
      {currentStep === 2 && (
        <WellnessForm formData={formData} handleChange={handleChange} />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {currentStep > 1 && (
          <button
            onClick={handlePreviousStep}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Previous
          </button>
        )}
        {currentStep < 2 ? (
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>

      {assessmentResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h3 className="text-xl font-bold">Assessment Results</h3>
          <p>
            <strong>Overall Score:</strong> {assessmentResult.overallScore}
          </p>
          <p>
            <strong>Insights:</strong> {assessmentResult.insights}
          </p>
          <div>
            <strong>Recommendations:</strong>
            <ul className="list-disc pl-6">
              {assessmentResult.recommendations &&
                assessmentResult.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;
