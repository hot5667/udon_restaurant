import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
// import testImg from '../../img/test.png';
import supabase from '../../supaBasecClient';

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
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loginUserId, setLoginUserId] = useState(null);

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
            <LeftMypage>
                {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : users.length > 0 ? (
                    users.map((user) => (
                        <UserInfo key={user.UserID}>
                            <h5>아이디: {user.UserID || 'N/A'}</h5>
                            <h5>이름: {user.UserNickName || 'N/A'}</h5>
                            <h5>나이: {user.age || 'N/A'}</h5>
                            <h5>주소: {user.UserCity || 'N/A'}</h5>
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
                        <PostBox key={post.PostTitle}>
                            <img
                                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${post.PostID}/${JSON.parse(post.PostImgs)[0]}`}
                            />
                            <p>{`${post.PostTitle}`}</p>
                        </PostBox>
                    ))
                )}
                <p>닉네임, 이메일, 관심동네, 내 댓글/게시글이라.....</p>
            </RightMypage>
        </MYPAGE_CONTAINER>
    );
};

export default MyPage;
