import React from 'react'
import styled from '@emotion/styled';
import { useLocation, useSearchParams } from 'react-router-dom';
import CreateForm from '../../components/CreateForm';
import '../../css/font.css';

const CreatePostPage = () => {
  const [searchParams, _] = useSearchParams();
  const isToModify = searchParams.get('isToModify');
  // const id = searchParams.get('id');

  const { state: post } = useLocation();
  // console.log('Post :',post);

  return (
    <CreateBody>
      <div style={{ width: '100%', height: '50px', display: 'flex' }}>
        <h5 style={{ margin: 'auto', fontSize: '30px' }}>맛집 {isToModify ? '공사' : '추천'} 중</h5>
      </div>
      <CreateForm Modify={{ isToModify, post }} />
    </CreateBody>
  );
};

export default CreatePostPage;

const CreateBody = styled.div`
    width: 1080px;
    height: 100%;
    margin: 0 auto;
    margin-top: 50px;

    * {
        font-family: GmarketSansMedium;
        font-weight: 500;
    }

    h5 {
        font-family: GmarketSans;
        font-weight: 700;
    }
`;
