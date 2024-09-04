import React, { useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { AuthContext } from '../context/AuthContext';
import MypageLogo from '../img/notext.png';
import '../css/font.css';

const PostListPage = () => {
    const [searchParams, _] = useSearchParams();
    const city = searchParams.get('city');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
                            <Link to="/sign-up" style={{ textDecoration: 'none', color: 'black' }}>
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
                {/* <PostGrids>
        {posts.map((post) => {
          return <PostCard post={post} key={`PostCard-${post.PostID}`} />
        })}
      </PostGrids> */}
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
