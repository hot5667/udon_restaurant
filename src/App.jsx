import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PostDetail from './pages/PostDetail';
import TestPages from './pages/TestPages';
import Router from "./shared/Router"
import { createContext, useState } from 'react';

export const PostsContext = createContext();

function App() {
  return (
    <>
      <Router/>
    </>
  );
}

export default App;