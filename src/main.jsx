import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './reset.css'
import PostsNumberProvider from './context/PostsNumberProvider.jsx'

createRoot(document.getElementById('root')).render(
  <PostsNumberProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </PostsNumberProvider>,
)
