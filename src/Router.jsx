import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import PostContextProvider from './context/PostContext';
import SignUp from "./pages/login-page/signUp";
import SignIn from "./pages/login-page/signIn";
import Profile from "./pages/my-page/Profile";
import AlreadyRegistered from "./pages/login-page/AlreadyRegistered";
import AuthCallback from "./components/AuthCallback";
import PostListPage from "./pages/PostListPage";
import MainPage from "./pages/main-page/MainPage";
import CreatePostPage from "./pages/create-post-page/CreatePostPage";
import WrapperComponent from "./components/WrapperComponent";
import PostDetail from "./pages/post-page/PostDetail";
import SideBar from './components/sideBar';
import SocialSignUp from './pages/login-page/SocialSignUp';

const RouterComponent = () => {
  return (
    <Router>
      <AuthProvider>
        <PostContextProvider>
          <Routes>
            <Route element={<WrapperComponent />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post-list" element={<PostListPage />} />
              <Route path="/detail" element={<PostDetail />} />
              <Route path="/create" element={<CreatePostPage />} />
            </Route>
            <Route path="/social-sign-up" element={<SocialSignUp />} />
            <Route path="/already-registered" element={<AlreadyRegistered />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </PostContextProvider>
      </AuthProvider>
    </Router>

  );
};

export default RouterComponent;
