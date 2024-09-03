import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { PostContext } from '../context/PostContext'; // Import PostContext
import { useNavigate } from 'react-router-dom';
import defaultImg from '../img/default-img.png';
import heartIcon from '../img/heart-icon.svg'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_NAME = "images";

const PostCard = ({ post }) => {
  const { PostID, PostImgs, PostTitle, PostLike } = post;
  const { user } = useContext(AuthContext); // Use AuthContext to get user
  const navigate = useNavigate();
  let imgArray = JSON.parse(PostImgs);
  if (imgArray.some(img => img.includes('https'))) {
    imgArray = [];
  }

  return (
    <Card onClick={(e) => {
      e.preventDefault();
      if (user) {
      // alert(`Post ID : ${PostID}`);
      navigate(`/detail?id=${PostID}`, {state:post.UserID});

      }else {
        alert('로그인해야 확인 가능합니다. 로그인 페이지로 이동합니다.');
        navigate('/sign-in');
        return;
      }
    }}>
      {
        imgArray.length === 0
          ? <img className='card_img' src={defaultImg} alt="Default" />
          : <img className='card_img' src={`${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/${PostID}/${imgArray[0]}`} alt="Post" />
      }
      <p className='post_title'>{PostTitle}</p>
      <div className='post_like_container'>
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="#ff0000" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
        </svg> */}
        <img className='like_icon' src={heartIcon}/>
        <p className='post_like'>{JSON.parse(PostLike).length}</p>
      </div>
    </Card>
  );
};

export default PostCard;

const Card = styled.div`
  width: 255px;
  height: 300px;

  padding: 10px;
  background-color: #eaeaea;
  border: 1px solid lightgray;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  cursor: pointer;

  .card_img {
    width: 100%;
    height: 70%;
    object-fit: cover;

    border: 1px solid lightgray;
    border-radius: 10px;
  }

  .post_title {
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post_like_container {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .post_like_container .post_like {
    /* margin: auto; */
  }

  .like_icon {
    width: 20px;
    margin-right: 10px;
    color: red;
  }
`;