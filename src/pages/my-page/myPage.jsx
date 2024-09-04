import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import supabase from '../../supaBasecClient';
import logoHacan from '../../img/logoHacan.png';
import MypageLogo from '../../img/notext.png';
import '../../css/mypage.css';
import '../../css/font.css';

const MyPage = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loginUserId, setLoginUserId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 세션에서 사용자 정보를 가져옴
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !sessionData.session) {
                    throw new Error('세션 정보를 가져오는 데 실패했습니다.');
                }

                const userId = sessionData.session.user.id;
                setLoginUserId(userId);

                // 사용자 정보를 불러옴
                const { data: userData, error: userError } = await supabase
                    .from('User')
                    .select('*')
                    .eq('UserID', userId);
                console.log(userId);
                if (userError) {
                    throw new Error('사용자 정보를 불러오는 데 실패했습니다.');
                }
                setUsers(userData || []);

                const { data: postData, error: postError } = await supabase.from('Post').select().eq('UserID', userId);
                if (postError) {
                    throw new Error('게시글이 없습니다');
                }
                setPosts(postData || []);
            } catch (err) {
                setError(err.message);
                console.error(err);
            }
        };

        fetchUserData();
    }, []);

    return (
        <MYPAGE_CONTAINER>
            <HeaderDiv>
                <div className="header">
                    <h1
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        우동집
                    </h1>
                    <UlDiv>
                        <li>
                            {users ? (
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
                        </li>
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
            <h1 style={{ margin: 30, fontSize: 30 }}>마이페이지</h1>
            <LeftMypage>
                <img src={MypageLogo} style={{ width: 150, float: 'left' }} />
                {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : users.length > 0 ? (
                    users.map((user) => (
                        <UserInfo key={user.UserID}>
                            <h5>이름: {user.UserNickName || 'N/A'}</h5>
                            <h5>지역: {user.UserCity || 'N/A'}</h5>
                        </UserInfo>
                    ))
                ) : (
                    <p>사용자 정보를 불러오고 있습니다...</p>
                )}
            </LeftMypage>
            <RightMypage>
                {/* {[...Array(6)].map((_, index) => (
                        <img key={index} src={testImg} alt={`post-${index}`} />
                    ))} */}
                {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    posts.map((post) => (
                        <PostBox
                            className="rightBox"
                            key={post.PostTitle}
                            onClick={(e) => {
                                e.preventDefault();
                                if (users) {
                                    navigate(`/detail?id=${post.PostID}`, { state: post.UserID });
                                }
                            }}
                        >
                            <img
                                className="postImg"
                                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.PostID}/${JSON.parse(post.PostImgs)[0]}`}
                            />
                            <PostBoxDiv>
                                <h2>{post.PostTitle}</h2>
                                <h3>{post.PostDate}</h3>
                                <p className="content">{post.PostContent}</p>
                            </PostBoxDiv>
                        </PostBox>
                    ))
                )}
            </RightMypage>
        </MYPAGE_CONTAINER>
    );
};

export default MyPage;

const MYPAGE_CONTAINER = styled.div`
    width: 96%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: 0;
    position: relative;
    margin: 30px 30px 30px 90px;
    font-family: GmarketSansMedium;
`;

const LeftMypage = styled.div`
    max-width: 1080px;
    border-radius: 20px;
    display: flex;
    float: left;
    border: 2px solid #fea100;
`;

const RightMypage = styled.div`
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(3, minmax(40px, 400px));
    gap: 25px;
    justify-content: center;
    margin: 20px;
`;

const PostBox = styled.div`
    overflow: hidden;
    display: block;
    img {
        object-fit: cover;
        width: 100%;
        height: 50%;
        border-radius: 10px;
    }
`;

const PostBoxDiv = styled.div`
    overflow: hidden;
    display: block;
    width: 100%;
    height: 100%;
    padding-top: 20px;
    padding-right: 20px ;

    h2 {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 10px;
    }

    h3 {
        font-size: 13px;
        font-weight: 300;
        margin-bottom: 10px;
        color: #696969;
    }

    p {
        margin-bottom: 10px;
        color: #696969;
    }
`;

const UserInfo = styled.div`
    margin-bottom: 20px;
    border-radius: 15px;
    padding: 20px;
`;

const HeaderDiv = styled.div`
    background-color: white;

    width: inherit;
    height: fit-content;
    position: sticky;
    top: 0;
    z-index: 1;

    padding: 20px 0;

    .header {
        width: 100%;
        display: flex;
        position: relative;
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
