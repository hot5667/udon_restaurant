import React from 'react';
import SideBar from '../component/sideBar';
import MyPage from '../component/myPage';

const test = () => {
  return (
    <div>
      {/* 항상 상단에 고정해야함 */}
      <SideBar />
      test
      <MyPage />
    </div>
  );
};

export default test;
