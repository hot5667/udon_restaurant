import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';
import MypageLogo from '../img/notext.png';
import '../css/font.css';

const PostListPage = () => {
  const { user, signOutUser, loading: authLoading } = useContext(AuthContext);
  const { loading: postsLoading } = useContext(PostContext);

  const [searchParams, _] = useSearchParams();
  const city = searchParams.get('city');
  const navigate = useNavigate();
  // 상태 추가
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      alert("회원가입은 로그인된 사용자에게는 필요하지 않습니다.");
      setShowAlert(false); // 알림창을 한 번만 띄우도록 상태 초기화
    }
  }, [showAlert]);

  if (authLoading || postsLoading) return <p>로딩 중...</p>;

  const handleSignUpClick = (e) => {
    e.preventDefault();
    if (user) {
      // 로그인 상태일 때 회원가입 버튼 클릭 시 알림창 표시
      setShowAlert(true);
    } else {
      // 로그인 상태가 아닐 때 회원가입 페이지로 이동
      navigate("/sign-up");
    }
  };

  return (
    <PostListBody>
      <HeaderDiv>
        <div className="header">
          <h1
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            style={{ cursor: 'pointer' }}
          >
            {city ?? '전국'}
          </h1>
          <UlDiv>
            {user ? (
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                onClick={(e) => {
                  e.preventDefault();
                  signOutUser();
                }}
              >
                로그아웃
              </Link>
            ) : (
              <Link to="/sign-in" style={{ textDecoration: 'none', color: 'black' }}>
                로그인
              </Link>
            )}
            <hr
              style={{
                height: '18px',
                width: '1px',
                backgroundColor: 'black',
                border: 'none',
                margin: '0 15px',
              }}
            />
            <li>

              <Link
                to="#"
                onClick={handleSignUpClick} // 클릭 핸들러 추가
                style={{ textDecoration: 'none', color: 'black' }}>
                회원가입
              </Link>
            </li>
          </UlDiv>
          <MyPageMove>
            <img
              src={MypageLogo}
              onClick={() => {
                navigate('/MyPage');
              }}
            />
          </MyPageMove>
        </div>
      </HeaderDiv>
      <PostBox>
        <PostList />
      </PostBox>
    </PostListBody>
  );
};

export default PostListPage;

const PostListBody = styled.div`
    width: 96%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0 auto;
    padding: 0;
    margin-left: 80px;
    margin-top: 30px;
    font-family: GmarketSansMedium;
`;

const PostGrids = styled.div`
    width: 100%;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
`;
const HeaderDiv = styled.div`
    background-color: white;

    width: inherit;
    height: fit-content;
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 20px 0;

    .header {
        width: 100%;
        display: flex;
        position: relative;
        align-items: center;
    }

    h1 {
        font-size: 50px;
        font-family: 'LOTTERIACHAB';
        color: #fea100;

        z-index: 1;

        margin: auto;
    }
`;

const UlDiv = styled.ul`
  height: fit-content;

  position: absolute;
  top: 0;
  right: 6%;
  z-index: 1;

    display: flex;
    align-items: center;
    margin-top: 20px;
`;

const MyPageMove = styled.div`
    position: absolute;

    right: 0;
    z-index: 1;
    img {
        width: 50px;
    }
`;

const PostBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 30px;
    max-width: 1080px;
`;
