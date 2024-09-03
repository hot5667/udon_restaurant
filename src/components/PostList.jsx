import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import supabase from '../supaBasecClient';
import PostCard from './PostCard';
import emtpyIcon from '../img/empty-icon.png'

const PostList = () => {
  const [searchParams, _] = useSearchParams();
  const city = searchParams.get('city');
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (city) {
        const { data, error } = await supabase.from("Post").select("*").eq('PostCity', city);

        if (error) {
          throw error;
        } else {
          console.log("data => ", data);
          setPosts(data)
        }
      } else {
        const { data, error } = await supabase.from("Post").select("*");

        if (error) {
          throw error;
        } else {
          console.log("data => ", data);
          setPosts(data.reverse())
        }
      }
    };

    fetchData();
  }, [location.search]);

  return (
    <PostListContainer>
      {
      posts.length === 0 ?
        <EmptyDiv>
          <p>작성된 게시글이 없습니다.</p>
          <img src={emtpyIcon}/>
        </EmptyDiv>
      : <PostGrids>
        {posts.map((post) => {
          return <PostCard post={post} key={`PostCard-${post.PostID}`}/>
        })}
      </PostGrids>
      }
    </PostListContainer>
  )
}

export default PostList

const PostListContainer = styled.div`
  width: 100%;
`

const PostGrids = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
`

const EmptyDiv = styled.div`
  width: 100%;

  padding-top: 50px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  p {
    font-size: 30px;
  }

  img {
    width: 800px;
  }
`