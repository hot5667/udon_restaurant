
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostDetail from './pages/PostDetail';
import TestPages from './pages/TestPages';
import Router from './shared/Router';
import Comment from './components/Comment';
import { createContext, useState } from 'react';

export const PostsContext = createContext();

function App() {
  return (
    <>
      <Comment />
      <Router />
    </>
  );
}

export default App;
