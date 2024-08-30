import { React, useEffect, useState } from 'react';
import styled from 'styled-components';
import testImg from '../img/test.png';
import supabase from '../supaBasecClient';

const MYPAGE_CONTAINER = styled.div`
  margin: 30px 30px 30px 130px;
`;

const LeftMypage = styled.div`
  float: left;
  margin: 110px;
  padding-right: 80px;
  border-right: 2px solid #000;
`;

const RightMypage = styled.div`
  float: left;
  margin: 110px;
`;

const PostBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, auto));
  gap: 20px;
  border: 2px solid #000;
  float: right;
`;

const myPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // 외부 통신(supabase)
      // const response = await supabase.from('posts').select('*');
      // setPosts(response.data);
      const { data, error } = await supabase.from('User').select('*');
      if (error) {
        console.log(error);
      }
      else {
        console.log(data);
        setUsers(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <MYPAGE_CONTAINER>
      <LeftMypage>
        {/* <img className="myPageImg" src={testImg} alt={a} />
        <ul>
          <li>
            <p>닉네임</p>
          </li>
          <li>
            <p>이메일</p>
          </li>
          <li>
            <p>관심동네</p>
          </li>
        </ul> */}
        {users.map(user => {
          return (
            <div
              key={user.id}
              style={{
                border: '1px solid black',
              }}
            >
              <h5>아이디 : {user.PostCity}</h5>
              <h5>이름 : {user.name}</h5>
              <h5>나이 : {user.age}</h5>
              <h5>주소 : {user.address}</h5>
            </div>
          );
        })}
      </LeftMypage>
      <RightMypage>
        <PostBox>
          <img src={/*url들어갈자리*/ testImg} /*alt={a}*/ />
          <img src={/*url들어갈자리*/ testImg} /*alt={a}*/ />
          <img src={/*url들어갈자리*/ testImg} /*alt={a}*/ />
          <img src={/*url들어갈자리*/ testImg} /*alt={a}*/ />
          <img src={/*url들어갈자리*/ testImg} /*alt={a}*/ />
          <img src={/*url들어갈자리*/ testImg} /*alt={a}*/ />
        </PostBox>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
      </RightMypage>
    </MYPAGE_CONTAINER>
    //닉네임, 이메일?, 관심 동네, 내 댓글/게시글
  );
};

export default myPage;
