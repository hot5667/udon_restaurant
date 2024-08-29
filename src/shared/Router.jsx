import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import CreatePostPage from '../pages/CreatePostPage'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<MainPage />} />
        <Route path={'/create'} element={<CreatePostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router