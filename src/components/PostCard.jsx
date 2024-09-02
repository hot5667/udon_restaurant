import React from 'react'
import styled from 'styled-components'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_NAME = 'images';

const PostCard = ({post}) => {
  const {PostID, PostImgs, PostTitle, PostLike} = post;

  return (
    <Card onClick={() => {
      alert(`Post ID : ${PostID}`);
    }}>
      <img src={`${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/${post.PostID}/${JSON.parse(PostImgs)[0]}`} />
      <p className='post_title'>{PostTitle}</p>
      <div className='post_like_container'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="#ff0000" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
      </svg>
      <p className='post_like'>{PostLike}</p>
      </div>
    </Card>
  )
}

export default PostCard

const Card = styled.div`
  width: 255px;
  height: 300px;

  padding: 10px;
  background-color: bisque;
  border: 1px solid lightgray;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  cursor: pointer;

  img {
    width: 100%;
    height: 70%;
    object-fit: cover;

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

  svg {
    width: 20px;
    margin-right: 10px;
    color: red;
  }
`

