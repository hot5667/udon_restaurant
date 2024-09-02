import React from 'react';

//react-router-dom을 사용하기 위해 api import
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Test from '../pages/test';
import SideBar from '../component/sideBar';
import MyPage from '../component/myPage';

const Router = () => {
  return (
    <BrowserRouter>
      {/* <SideBar /> */}
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/MyPage/:id" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
