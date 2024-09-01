import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signUp';
import SignIn from './pages/signIn';
import Profile from './pages/Profile';
import AlreadyRegistered from './pages/AlreadyRegistered';
import AuthCallback from './components/AuthCallback';

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/already-registered" element={<AlreadyRegistered />} />
        <Route path="/" element={<SignUp />} /> 
        <Route path="/" element={<TestPages />} />
        <Route path="detail" element={<PostDetail />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
