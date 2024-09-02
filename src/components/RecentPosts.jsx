import React, { useEffect, useState } from 'react'
import supabase from '../supaBasecClient'
import styled from 'styled-components';
import RecentPost from './RecentPost';


const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Post").select("*");
      if (error) {
        throw error;
      } else {
        data.sort((a,b) => a.PostID - b.PostID)
        // console.log("data => ", data);
        setRecentPosts(data.slice(-4).reverse());
      }
    };

    fetchData();
  }, []);


  return (
    <RecentDiv>
      <h1 style={{fontSize:'24px'}}>최신글</h1>
      <hr/>
      {recentPosts.map(recent => {

        return <RecentPost post={recent} key={`Post${recent.PostID}`} />
      })}
    </RecentDiv>
  )
}

export default RecentPosts

const RecentDiv = styled.div`
  width: 100%;
  /* height: 500px; */

  padding: 20px;

  background-color: gray;

  hr {
    height: 1px;
    border: none;
    background-color: black;
  }
`