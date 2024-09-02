import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/login-page/signUp';
import SignIn from './pages/login-page/signIn';
import Profile from './pages/my-page/Profile';
import AlreadyRegistered from './pages//login-page/AlreadyRegistered';
import AuthCallback from './components/AuthCallback';
import MainPage from './pages/main-page';
import CreatePostPage from './pages/create-post-page';

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<MainPage />} />
        <Route path={'/create'} element={<CreatePostPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/MyPage/:id" element={<MyPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/already-registered" element={<AlreadyRegistered />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
