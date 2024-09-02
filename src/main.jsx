import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './reset.css'
import PostsNumberProvider from './context/PostContext.jsx'

createRoot(document.getElementById('root')).render(
  <PostsNumberProvider>
      <App />
  </PostsNumberProvider>,
);