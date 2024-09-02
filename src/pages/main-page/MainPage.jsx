import React from 'react'
import {useNavigate} from 'react-router-dom'
import styled from '@emotion/styled';
import RecentPosts from '../../components/RecentPosts';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <MainBody>
      우동집 Main
      <RecentPosts />
      <button
        onClick={() => {
          navigate('/create');
        }}
      >
        게시글 작성하기
      </button>
      {/* <button onClick={() => {navigate(`/create?isToModify=${true}&id=${2}`)}}>게시글 수정하기</button> */}
    </MainBody>
  );
};

export default MainPage;

const MainBody = styled.div`
  width: 1080px;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  padding: 0;
`;
