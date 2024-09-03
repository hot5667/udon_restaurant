import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import RecentPosts from "../../components/RecentPosts";
import PostList from "../../components/PostList";
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import "../../css/font.css";

const MainPage = () => {
  const navigate = useNavigate();
  const { user, signOutUser, loading: authLoading } = useContext(AuthContext);
  const { fetchPosts, posts, loading: postsLoading } = useContext(PostContext);

  // 상태 추가
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log("User state:", user);
  }, [user]);

  useEffect(() => {
    if (!posts) fetchPosts();
  }, [fetchPosts, posts]);

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
    <>
      <MainBody>
        <HeaderDiv>
          <div className="header">
            <Title
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              style={{ cursor: "pointer" }}
            >
              우동집
            </Title>
            <UlDiv>
              <li>
                {user ? (
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    onClick={(e) => {
                      e.preventDefault();
                      signOutUser();
                    }}
                  >
                    로그아웃
                  </Link>
                ) : (
                  <Link
                    to="/sign-in"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    로그인
                  </Link>
                )}
              </li>
              <Separator />
              <li>
                <Link
                  to="#"
                  onClick={handleSignUpClick} // 클릭 핸들러 추가
                  style={{ textDecoration: "none", color: "black" }}
                >
                  회원가입
                </Link>
              </li>
            </UlDiv>
          </div>
        </HeaderDiv>

        <RecentPosts />
        <PostList />
      </MainBody>
    </>
  );
};

export default MainPage;

const MainBody = styled.div`
  width: 1080px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 0;
`;

const HeaderDiv = styled.header`
  background-color: white;
  width: 100%;
  height: fit-content;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 50px;
  font-family: "LOTTERIACHAB";
  color: #fea100;
  margin: 0;
  cursor: pointer;
  user-select: none;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 10px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: black;
  margin: 0 10px;
  &:hover {
    text-decoration: underline;
  }
`;

const Separator = styled.hr`
  height: 18px;
  width: 1px;
  background-color: black;
  border: none;
  margin: 0 10px;
`;

const AddPostButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background-color: #fea100;
  position: fixed;
  bottom: 20px;
  right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #dc8b00;
  }
  svg {
    width: 25px;
  }
`;

const UlDiv = styled.ul`
  height: fit-content;
  position: absolute;
  top: 8px;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-top: 3px;
`;