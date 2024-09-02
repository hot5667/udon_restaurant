import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import supabase from '../supaBasecClient';
import PostCard from './PostCard';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Post").select("*");
      if (error) {
        throw error;
      } else {
        console.log("data => ", data);
        setPosts(data)
      }
    };

    fetchData();
  }, []);

  return (
    <PostListContainer>
      <p>PostList</p>
      <PostGrids>
        {posts.map((post) => {
          return <PostCard post={post} key={`PostCard-${post.PostID}`}/>
        })}
      </PostGrids>
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