import React, { useContext, useEffect } from 'react';
import styled from '@emotion/styled';
import { useLocation, useSearchParams, Link, useNavigate } from 'react-router-dom';
import CreateForm from '../../components/CreateForm';
import { AuthContext } from '../../context/AuthContext';
import '../../css/font.css';
import MypageLogo from '../../img/notext.png';

const CreatePostPage = () => {
    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    const isToModify = searchParams.get('isToModify');
    // const id = searchParams.get('id');

    const { state: post } = useLocation();
    // console.log('Post :',post);
    const { user, signOutUser, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
        // Ensure to log the user state for debugging
        console.log('User state:', user);
    }, [user]); // Depend on user state

    return (
        <CreateBody>
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
            <PostBox>
                <div style={{ width: '100%', height: '50px', display: 'flex' }}>
                    <h5 style={{ margin: 'auto', fontSize: '30px' }}>맛집 {isToModify ? '공사' : '추천'} 중</h5>
                </div>
                <CreateForm Modify={{ isToModify, post }} />
            </PostBox>
        </CreateBody>
    );
};

export default CreatePostPage;

const CreateBody = styled.div`
    width: 100%;
    height: 100%;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;

    * {
        font-family: GmarketSansMedium;
        font-weight: 500;
    }

    h5 {
        font-family: GmarketSans;
        font-weight: 700;
    }
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
        justify-content: center;
        flex-direction: column;
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
    right: 10%;
    z-index: 1;

    display: flex;
    align-items: center;
    margin-top: 3px;

    margin-right: 10px;
`;

const MyPageMove = styled.div`
    position: absolute;
    right: 4%;
    z-index: 1;
    img {
        width: 50px;
    }
`;

const Title = styled.h1`
    font-size: 50px;
    font-family: 'LOTTERIACHAB';
    color: #fea100;
    margin: 0;
    cursor: pointer;
    user-select: none;
`;

const PostBox = styled.div`
    line-height: 30px;
    max-width: 1080px;
    margin: 0 auto;
`;
