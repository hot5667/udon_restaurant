import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import SignUp from './pages/login-page/signUp';
import SignIn from './pages/login-page/signIn';
import Profile from './pages/my-page/Profile';
import AlreadyRegistered from './pages//login-page/AlreadyRegistered';
import AuthCallback from './components/AuthCallback';
import PostListPage from './pages/PostListPage';
import MainPage from './pages/main-page/MainPage';
import CreatePostPage from './pages/create-post-page/CreatePostPage';
import MyPage from './pages/my-page/myPage'
import SideBar from './components/sideBar';
// import SignOut from './pages/signOut';

const SideBarLayout = () => {
  return (
    <>
    <SideBar>
      <Outlet/>
      </SideBar>
    </>
  )
}

const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        {/* <Route element={<SideBar />}> */}
          <Route path='/' element={<MainPage />} />
          <Route path='/create' element={<CreatePostPage />}s />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          {/* <Route path="/sign-out" element={<SignOut />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/MyPage/:id" element={<MyPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/already-registered" element={<AlreadyRegistered />} />
          <Route path="/" element={<SignUp />} />
          <Route path="/post-list" element={<PostListPage />} />
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default RouterComponent;