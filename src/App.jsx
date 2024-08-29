import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostDetail from './pages/PostDetail';
import TestPages from './pages/TestPages';
import { createContext, useState } from 'react';

export const PostsContext = createContext();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestPages />} />
        <Route path="detail" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
