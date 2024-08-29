import React from 'react'
import styled from 'styled-components'

const RecentPost = ({post}) => {
  const {PostTitle:title, PostImgs:imgUrl, PostContent:content, PostCity:city} = post;
  // console.log(title, JSON.parse(imgUrl))
  return (
    <PostCard>
      <img src={JSON.parse(imgUrl)[0]} />
      <CardContent>
      <h3>{title}</h3>
      <Button onClick={() => {
        alert(`Post ID : ${post.PostID}`);
      }}>
        게시글로 이동
      </Button>
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