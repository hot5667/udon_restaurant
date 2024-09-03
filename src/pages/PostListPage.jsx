import React, { useContext, useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import supabase from '../supaBasecClient';
import styled from 'styled-components';
import PostCard from '../components/PostCard';
import { PostContext } from '../context/PostContext';

const PostListPage = () => {
  const [searchParams, _] = useSearchParams();
  const city = searchParams.get('city');
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const {user} = useContext(PostContext)

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
    <PostListBody>
    <HeaderDiv>
      <div className='header'>
        <h1 onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }} style={{cursor:'pointer'}}>{city ? city : '전국'}</h1>
        <UlDiv>
          {
            user ?
            <Link  style={{textDecoration:'none', color:'black'}} onClick={(e) => {
              e.preventDefault();
              signOutUser();
            }}>로그아웃</Link>
            : <Link to='/sign-in' style={{textDecoration:'none', color:'black'}}>로그인</Link>
          }
          <hr style={{height: '18px', width:'1px', backgroundColor:'black', border:'none', margin:'0 3px'}}/>
          <li>
            <Link to='/sign-up' style={{textDecoration:'none', color:'black'}}>회원가입</Link>
          </li>
        </UlDiv>
      </div>
    </HeaderDiv>
      <PostGrids>
        {posts.map((post) => {
          return <PostCard post={post} key={`PostCard-${post.PostID}`} />
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
const HeaderDiv = styled.div`
  background-color: white;

  width: inherit;
  height: fit-content;

  position: sticky;
  top:0;
  z-index: 1;

  padding: 10px 0;

  .header {
    width: 100%;
    display: flex;

    position: relative;
  }

  h1 {
    font-size:50px;
    font-family:'LOTTERIACHAB';
    color: #fea100;

    z-index: 1;

    margin: auto;
  }
`

const UlDiv = styled.ul`

  /* width: 100%; */
  height: fit-content;

  position:absolute;
  top:0;
  right: 0;
  z-index: 1;

  display: flex;
  align-items: center;
  margin-top: 3px;
`