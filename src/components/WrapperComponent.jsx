import { Outlet } from "react-router-dom";
import SideBar from "./sideBar";

const WrapperComponent = () => {
  return (
    <div>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default WrapperComponent;
