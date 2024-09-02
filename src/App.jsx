import RouterComponent from "./Router";
import { createContext } from "react";

export const PostsContext = createContext();

function App() {
  return (
    <>
      <RouterComponent />
    </>
  );
}

export default App;
