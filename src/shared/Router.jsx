import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import CreatePostPage from '../pages/CreatePostPage'
import SignUp from '../pages/signUp'
import SignIn from '../pages/signIn'
import PostListPage from '../pages/PostListPage'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<MainPage />} />
        <Route path={'/create'} element={<CreatePostPage />} />
        <Route path="/post-list" element={<PostListPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router