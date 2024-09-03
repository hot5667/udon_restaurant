import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import supabase from '../supaBasecClient';
import { PostContext } from '../context/PostContext';
import defaultImg from '../img/default-img.png'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_NAME = "images";

const RecentPost = ({ post }) => {
  const navigate = useNavigate();
  const { PostTitle: title, PostImgs: imgs, PostContent: content, PostCity: city } = post;
  const {user} = useContext(PostContext);

  // const publicUrl = supabase.storage.from(STORAGE_NAME).getPublicUrl(`${post.PostID}/${JSON.parse(imgs)[0]}`);
  // console.log('recent Post :',post);
  // console.log(`/${post.PostID}/${JSON.parse(imgs)[0]}`)
  // console.log(`${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/${post.PostID}/${JSON.parse(imgs)[0]}`)
  // console.log(supabase
  //   .storage
  //   .from(STORAGE_NAME)
  //   .getPublicUrl(`${post.PostID}/${post.PostID}_0`).data.publicUrl
  // )
  let imgArray = JSON.parse(imgs);
  if (imgArray.some(img => img.includes('https'))){
    imgArray = [];
  }
  return (
    <PostCard className='embla__slide'>
      {
      imgArray.length === 0 ?
      <img src={defaultImg} />
      : <img src={`${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/${post.PostID}/${imgArray[0]}`} />
      }
      
      <CardContent>
        <h3>{title}</h3>
        <Button onClick={(e) => {
          e.preventDefault();
          if (user) {
            navigate(`/detail?id=${post.PostID}`, {state:post.UserID});
          }else {
            alert('로그인해야 확인 가능합니다. 로그인 페이지로 이동합니다.');
            navigate('/sign-in');
            return;
          }
        }}>
          이동
        </Button>
        {/* <Button2 onClick={() => {
          const fixedPost = {...post, PostImgs:JSON.parse(post.PostImgs)};
          if (!user) {
            alert('로그인해야 수정할 수 있습니다. 로그인 페이지로 이동합니다.');
            navigate('/sign-in');
          } else if (user.UserID !== post.UserID) {
            alert('작성자만 수정할 수 있습니다.');
            return;
          } else {
            navigate(`/create?isToModify=${true}&id=${post.PostID}`, { state:fixedPost });
          }
        }}>
          게시글 수정
        </Button2> */}
      </CardContent>
    </PostCard>
  );
};

export default RecentPost;

const PostCard = styled.div`
  width: 100%;
  height: 400px;

  display: flex;
  justify-content: space-around;

  background-color: white;
  /* border: 1px solid lightgray; */
  border-radius: 30px;
  overflow: hidden;

  img {
    width: 70%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  width: 30%;
  height: 100%;

  background-color: #fcebce;
  /* display: flex;
  flex-direction: column;
  justify-content: space-around; */

  padding: 20px;

  position: relative;
`;

const Button = styled.button`
  width: 40px;
  height: 40px;
  padding-bottom: 3px;

  border: 1px solid lightgray;
  border-radius: 40px;

  position: absolute;
  bottom: 30px;
  right: 30px;

  background-color: white;

  cursor: pointer;
  &:hover {
    background-color: #e5e5e5;
  }
`;
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
  &:hover {
    background-color: #a5a5a5;
  }
`;
