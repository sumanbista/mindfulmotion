import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Meditation from './pages/Meditation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Setting';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meditation" element={<Meditation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/community" element = {<Community/>} />
      </Routes>
      </Layout>
     
    </Router>
  )
}

export default App
