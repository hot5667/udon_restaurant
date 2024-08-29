import React from 'react'
import styled from 'styled-components'
import { useLocation, useSearchParams } from 'react-router-dom';
import CreateForm from '../components/CreateForm';

const CreatePostPage = () => {
  const [searchParams, _] = useSearchParams();
  const isToModify = searchParams.get('isToModify');
  // const id = searchParams.get('id');

  const { state: post } = useLocation();
  // console.log('Post :',post);

  return (
    <CreateBody>
      게시글 {isToModify ? '수정' : '작성'} 중
      <CreateForm Modify={{isToModify, post}}/>
    </CreateBody>
  )
}

export default CreatePostPage

const CreateBody = styled.div`
  width: 1200px;
  height: 100%;

  margin: 0 auto;
`