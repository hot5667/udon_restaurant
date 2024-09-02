import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/login-page/signUp";
import SignIn from "./pages/login-page/signIn";
import Profile from "./pages/my-page/Profile";
import AlreadyRegistered from "./pages//login-page/AlreadyRegistered";
import AuthCallback from "./components/AuthCallback";
import PostListPage from "./pages/PostListPage";
import MainPage from "./pages/main-page/MainPage";
import CreatePostPage from "./pages/create-post-page/CreatePostPage";
import WrapperComponent from "./components/WrapperComponent";
import PostDetail from "./pages/post-page/PostDetail";
import SideBar from './components/sideBar';
// import SignOut from './pages/signOut';
import SocialSignUp from './pages/login-page/SocialSignUp';

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
        <Route element={<WrapperComponent />}>
          <Route path="/" element={<MainPage />} />
          {/* <Route path="/sign-out" element={<SignOut />} /> */}
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/MyPage/:id" element={<MyPage />} /> */}
          {/* <Route path="/" element={<SignUp />} /> */}
          <Route path="/post-list" element={<PostListPage />} />
          <Route path="/detail" element={<PostDetail />} />
        </Route>
        <Route path="/social-sign-up" element={<SocialSignUp />} />
        <Route path="/already-registered" element={<AlreadyRegistered />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default RouterComponent;
