import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import supabase from '../supaBasecClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_NAME = 'images';

const RecentPost = ({ post }) => {
  const navigate = useNavigate();
  const { PostTitle: title, PostImgs: imgs, PostContent: content, PostCity: city } = post;

  // const publicUrl = supabase.storage.from(STORAGE_NAME).getPublicUrl(`${post.PostID}/${JSON.parse(imgs)[0]}`);
  // console.log('recent Post :',post);
  // console.log(`/${post.PostID}/${JSON.parse(imgs)[0]}`)
  // console.log(`${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/${post.PostID}/${JSON.parse(imgs)[0]}`)
  // console.log(supabase
  //   .storage
  //   .from(STORAGE_NAME)
  //   .getPublicUrl(`${post.PostID}/${post.PostID}_0`).data.publicUrl
  // )
  return (
    <PostCard className='embla__slide'>
      <img src={`${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/${post.PostID}/${JSON.parse(imgs)[0]}`} />
      <CardContent>
        <h3>{title}</h3>
        <Button onClick={() => {
          alert(`Post ID : ${post.PostID}`);
        }}>
          게시글로 이동
        </Button>
        <Button2 onClick={() => {
          const fixedPost = {...post, PostImgs:JSON.parse(post.PostImgs)};
          // console.log('clicked Post :',post,JSON.parse(fixedPost.PostImgs));
          // fixedPost['PostImgs'] = JSON.parse(fixedPost.PostImgs);
          // console.log('clicked Post :',fixedPost);
          navigate(`/create?isToModify=${true}&id=${post.PostID}`, { state:fixedPost });
        }}>
          게시글 수정
        </Button2>
      </CardContent>
    </PostCard>
  )
}

export default RecentPost

const PostCard = styled.div`
  width: 100%;
  height: 400px;

  display: flex;
  justify-content: space-around;

  background-color: white;
  border-radius: 30px;
  overflow: hidden;

  img {
    width: 70%;
    height:100%;
    object-fit: cover;
  }
`

const CardContent = styled.div`
  width: 30%;
  height: 100%;

  /* display: flex;
  flex-direction: column;
  justify-content: space-around; */

  padding: 20px;

  position: relative;
`

const Button = styled.button`
  height: 30px;
  padding-bottom: 3px;
  
  border: 1px solid black;
  border-radius: 10px;

  position: absolute;
  bottom: 30px;
  right: 30px;

  background-color: lightgray;

  cursor: pointer;
  &:hover{
    background-color: #a5a5a5;
  }
`
const Button2 = styled.button`
  height: 30px;
  padding-bottom: 3px;
  
  border: 1px solid black;
  border-radius: 10px;

  position: absolute;
  bottom: 70px;
  right: 30px;

  background-color: lightgray;

  cursor: pointer;
  &:hover{
    background-color: #a5a5a5;
  }
`