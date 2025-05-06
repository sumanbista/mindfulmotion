import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import Home from './pages/Home';
import Meditation from './pages/Meditation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Setting';
import Community from './pages/Community';
import Journal from './pages/Journal';

import { ToastProvider } from './contexts/ToastContext';
import AssessmentPage from './pages/AssessmentPage';
import AIChat from './pages/AIChatPage'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/setting" element={<Settings />} />
            <Route path="/community" element={<Community />} />
            <Route path="/progress" element={<AssessmentPage />} />
            <Route path="/chat"       element={<AIChat/>}/>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
