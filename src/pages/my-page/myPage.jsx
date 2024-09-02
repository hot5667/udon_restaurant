import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import testImg from '../img/test.png';
import supabase from '../../supaBasecClient';
imp

const MYPAGE_CONTAINER = styled.div`
  display: flex;
  margin: 30px 30px 30px 130px;
`;

const LeftMypage = styled.div`
  margin-right: 80px;
  padding-right: 80px;
  border-right: 2px solid #000;
`;

const RightMypage = styled.div`
  flex-grow: 1;
`;

const PostBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, auto));
  gap: 20px;
  border: 2px solid #000;
`;

const UserInfo = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 20px;
`;

const MyPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('User').select('*');
        if (error) {
          setError('사용자 정보를 불러오는 데 실패했습니다.');
          console.error(error);
        } else {
          setUsers(data || []);
        }
      } catch (err) {
        setError('사용자 정보를 불러오는 중 문제가 발생했습니다.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <MYPAGE_CONTAINER>
      <LeftMypage>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          users.map(user => (
            <UserInfo key={user.id}>
              <h5>아이디: {user.UserID || 'N/A'}</h5>
              <h5>이름: {user.UserNickName || 'N/A'}</h5>
              <h5>나이: {user.age || 'N/A'}</h5>
              <h5>주소: {user.UserCity || 'N/A'}</h5>
            </UserInfo>
          ))
        )}
      </LeftMypage>
      <RightMypage>
        <PostBox>
          {[...Array(6)].map((_, index) => (
            <img key={index} src={testImg} alt={`post-${index}`} />
          ))}
        </PostBox>
        <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
      </RightMypage>
    </MYPAGE_CONTAINER>
  );
};

export default MyPage;