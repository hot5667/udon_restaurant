import React, { useContext, useEffect, useState } from 'react';
import defaultProfileImg from '../../img/image.png';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../../supaBasecClient';
import styled from '@emotion/styled';
import { AuthContext } from '../../context/AuthContext';
import DeletePost from '../../components/DeletePost';
import Comment from '../../components/Comment';
import UnLikeImg from '../../img/heart-empty-icon.svg';
import LikeImg from '../../img/heart-icon.svg';
import MypageLogo from '../../img/notext.png';
import MyPage from '../my-page/myPage';
import '../../css/font.css';

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;

const PostDetail = () => {
    const menu = {
        1: '한식',
        2: '중식',
        3: '일식',
        4: '양식',
        5: '분식',
        6: '야식/안주',
        7: '카페/디저트',
        8: '기타',
    };

    const navigate = useNavigate();

    const [searchParam] = useSearchParams();
    const postId = searchParam.get('id');
    const { user } = useContext(AuthContext);
    const { state: PostUserID } = useLocation();
    console.log('location :', useLocation());

    const [samePost, setSamePost] = useState({
        PostDate: '',
        PostCity: '',
        PostTitle: '',
        PostContent: '',
        PostFoodType: '',
        PostImgs: [],
        UserID: '',
        PostLike: '[]',
        Comments: [],
        UserProfile: null,
    });

    // const [postImgs, setPostImgs] = useState([]);
    const [profileImg, setProfileImg] = useState([]);
    const [like, setLike] = useState(0);

    useEffect(() => {
        const FindSamePost = async () => {
            const { data, error } = await supabase.from('Post').select('*, Comments (*)').eq('PostID', postId);
            if (error) {
                console.log('error=>', error);
            } else {
                // console.log(data);
                setSamePost((prev) => {
                    const curPost = { ...prev, ...data[0] };
                    curPost.PostImgs = JSON.parse(curPost.PostImgs);
                    return { ...curPost };
                });
                setLike(JSON.parse(data[0].PostLike).length);
            }
        };
        FindSamePost();

        // const FindPostImg = async () => {
        //   const { data, error } = await supabase.storage
        //     .from("images")
        //     .list(postId);
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     data;
        //   }
        //   // console.log(data);
        //   setPostImgs(data);
        // };
        // FindPostImg();

        const FindProfileImg = async () => {
            console.log('post userid', samePost);

            const { data, error } = await supabase.from('User').select('UserProfile').eq('UserID', PostUserID);
            if (error) {
                console.log('error=>', error);
            } else {
                console.log(data[0]);
                setSamePost((prev) => {
                    return { ...prev, UserProfile: data[0].UserProfile };
                });
            }
        };
        FindProfileImg();
    }, [like]);

    // useEffect(() => {
    //   const FindPostImg = async () => {
    //     const { data, error } = await supabase.storage
    //       .from("images")
    //       .list(postId);
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       data;
    //     }
    //     // console.log(data);
    //     setPostImgs(data);
    //   };
    //   FindPostImg();
    // }, []);

    // useEffect(() => {
    //   const FindProfileImg = async () => {
    //     const { data, error } = await supabase
    //       .from("User")
    //       .select("UserProfile")
    //       .eq("UserID", post.UserID);
    //     if (error) {
    //       console.log("error=>", error);
    //     } else {
    //       console.log(data);
    //       setProfileImg(data);
    //     }
    //   };
    //   FindProfileImg();
    // }, [samePost]);

    let likeArray = JSON.parse(samePost.PostLike);
    const handleLike = async (e) => {
        e.preventDefault();
        console.log('Like Array :', like, likeArray);
        if (likeArray.includes(user.UserID)) {
            try {
                likeArray = likeArray.filter((id) => id !== user.UserID);
                console.log('remove like :', likeArray);
                const { error } = await supabase.from('Post').update({ PostLike: likeArray }).eq('PostID', post.PostID);
                if (error) throw error;

                console.log('add Like:', post.PostLike);
            } catch (error) {
                console.error('Error modifying Like:', error.message);
            }
            setLike((prev) => prev - 1);
        } else {
            try {
                // const likeArray = JSON.parse(post.PostLike);
                likeArray.push(user.UserID);
                const { error } = await supabase.from('Post').update({ PostLike: likeArray }).eq('PostID', post.PostID);
                if (error) throw error;

                console.log('Like modified:', post.PostLike);
            } catch (error) {
                console.error('Error modifying Like:', error.message);
            }
            setLike((prev) => prev + 1);
        }
    };

    console.log(samePost);

    const post = samePost;

    let tmp = post.PostContent;
    // console.log('tmp', tmp);
    tmp = tmp.split('\n').map((line, idx) => {
        return (
            <span key={`${postId}_line_${idx}`}>
                {line}
                <br />
            </span>
        );
    });

    // console.log(profileImg);
    return (
        <DetailPost>
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
                {post.PostImgs.map((img, idx) => {
                    return (
                        <img
                            style={{ width: '700px', margin: 'auto' }}
                            key={idx}
                            src={`${supabaseURL}/storage/v1/object/public/images/${post.PostID}/${img}`}
                        />
                    );
                })}
                <PostContents>
                    <p style={{ fontSize: '24px' }}> 제목: {post.PostTitle}</p>
                    <p style={{ wordWrap: 'break-word' }}>
                        {' '}
                        내용 <br />
                        {tmp}
                    </p>
                </PostContents>
                <ButtonStyle>
                    {user && user.UserID === post.UserID ? (
                        <div>
                            <button
                                onClick={() => {
                                    const fixedPost = {
                                        ...post,
                                        PostImgs: JSON.parse(post.PostImgs),
                                    };

                                    navigate(`/create?isToModify=${true}&id=${post.PostID}`, {
                                        state: fixedPost,
                                    });
                                }}
                            >
                                게시글 수정
                            </button>
                            <DeletePost id={post.PostID} />
                        </div>
                    ) : null}
                </ButtonStyle>
                <PostInfoDetail>
                    {post?.UserProfile ? (
                        <ProfileImg src={post?.UserProfile} />
                    ) : (
                        <ProfileImg src={defaultProfileImg} />
                    )}
                    <p> 작성자: {post.PostUserName}</p>
                    <p> 도시: {post.PostCity}</p>
                    <p> 음식종류: {menu[post.PostFoodType]}</p>
                    <p> 작성날짜: {post.PostDate}</p>
                    <LikeButton onClick={handleLike}>
                        {likeArray.includes(user?.UserID) ? <img src={LikeImg} /> : <img src={UnLikeImg} />}
                    </LikeButton>
                    {JSON.parse(post.PostLike).length}
                </PostInfoDetail>
                <CommentStyle>
                    <Comment />
                </CommentStyle>

                {post.Comments?.length ? (
                    post.Comments.map((comment) => {
                        return (
                            <CommentStyle key={comment.CommentID}>
                                <p>작성자:{comment.commentUserID}</p>
                                <p>작성날짜:{comment.CommentDate}</p>
                                <p style={{ wordWrap: 'break-word' }}>내용:{comment.CommentContent}</p>
                            </CommentStyle>
                        );
                    })
                ) : (
                    <CommentStyle> 작성된 댓글이 없습니다</CommentStyle>
                )}
            </PostBox>
        </DetailPost>
    );
};

export default PostDetail;

const PostInfoDetail = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 1px solid lightgrey;
    padding-bottom: 20px;
    max-width: 900px;
`;

const PostContents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 30px;
    max-width: 900px;
    margin-top: 30px;
`;

const CommentStyle = styled.div`
    max-width: 900px;
    border-top: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
`;

const DetailPost = styled.div`
    width: 96%;

    display: flex;
    padding-bottom: 30px;
    line-height: 30px;
    gap: 50px;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 0 auto; // margin 0은 위아래를 0 좌우 margin을 auto 가운데 정렬에 유용
    margin-left: 80px;
    margin-top: 30px;
    font-family: 'GmarketSansMedium';
`;

const ButtonStyle = styled.div`
    display: flex;

    margin: 0 0 0 auto;
`;

const ProfileImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50px;
`;

const HeaderDiv = styled.div`
    background-color: white;

    width: inherit;
    height: fit-content;
    position: sticky;
    top: 0;
    z-index: 1;

    padding: 20px 0;

    border-bottom: 2px solid #cecece;

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

const Title = styled.h1`
    font-size: 50px;
    font-family: 'LOTTERIACHAB';
    color: #fea100;
    margin: 0;
    cursor: pointer;
    user-select: none;
`;

const UlDiv = styled.ul`
    height: fit-content;

    position: absolute;
    top: 0;
    right: 6%;
    z-index: 1;

    display: flex;
    align-items: center;
    margin-top: 3px;

    margin-right: 10px;
`;
const LikeButton = styled.button`
    height: fit-content;
    background-color: transparent;
    border: none;
    img {
        width: 30px;
    }
`;

const MyPageMove = styled.div`
    position: relative;
    top: -15px;
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
    max-width: 900px;
`;
