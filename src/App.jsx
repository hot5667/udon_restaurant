import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostDetail from './pages/PostDetail';
import TestPages from './pages/TestPages';
import Comment from './components/Comment';
import RouterComponent from './Router'
import { createContext, useState } from 'react';

export const PostsContext = createContext();

function App() {
  return (
    <>
      <RouterComponent/>
    </>
  );
}

export default App;