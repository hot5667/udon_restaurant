import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import supabase from '../supaBasecClient';
import styled from 'styled-components';
import PostCard from '../components/PostCard';

const PostListPage = () => {
  const [searchParams, _] = useSearchParams();
  // const city = searchParams.get('city');
  const city = '서울';
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Post").select("*").eq('PostCity', city);
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
    <PostListBody>
      <p>PostList</p>
      <PostGrids>
        {posts.map((post) => {
          return <PostCard post={post} key={`PostCard-${post.PostID}`}/>
        })}
      </PostGrids>
    </PostListBody>
  )
}

export default PostListPage

const PostListBody = styled.div`
  width: 1080px;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 0 auto;
  padding: 0;
`

const PostGrids = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
`