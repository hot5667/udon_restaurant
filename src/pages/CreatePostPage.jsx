import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PostsNumberContext } from '../context/PostsNumberProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../supaBasecClient';
import CreateForm from '../components/CreateForm';

const CreatePostPage = () => {
  const [searchParams, _] = useSearchParams();
  const isToModify = searchParams.get('isToModify');
  const id = searchParams.get('id');



  return (
    <CreateBody>
      게시글 {isToModify ? '수정' : '작성'} 중
      <CreateForm isToModify={isToModify} ID={id}/>
    </CreateBody>
  )
}

export default CreatePostPage

const CreateBody = styled.div`
  width: 1200px;
  height: 100%;

  margin: 0 auto;
`