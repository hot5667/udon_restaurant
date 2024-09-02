
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
