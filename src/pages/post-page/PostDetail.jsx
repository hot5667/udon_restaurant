import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import supabase, { supabaseUrl } from "../../supaBasecClient";
import styled from "@emotion/styled";
import Comment from "../../components/Comment";
import { AuthContext } from "../../context/AuthContext";

const PostDetail = () => {
  const [searchParam] = useSearchParams();
  const postId = searchParam.get("id");
  const { user } = useContext(AuthContext);

  const [samePost, setSamePost] = useState([
    {
      PostDate: "",
      PostCity: "",
      PostTitle: "",
      PostContent: "",
      Comments: [],
      PostFoodType: "",
      UserID: "",
      PostLike: []
    },
  ]);

  const [postImgs, setPostImgs] = useState([]);

  useEffect(() => {
    const FindSamePost = async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*, Comments (*)")
        .eq("PostID", postId);
      if (error) {
        console.log("error=>", error);
      } else {
        console.log(data);
        setSamePost(data);
      }
    };
    FindSamePost();
  }, []);

  useEffect(() => {
    const FindPostImg = async () => {
      const { data, error } = await supabase.storage
        .from("images")
        .list(postId);
      if (error) {
        console.log(error);
      } else {
        data;
      }
      console.log(data);
      setPostImgs(data);
    };
    FindPostImg();
  }, []);

  console.log('samePost :', samePost);

  const [post] = samePost;
  return (
    <DetailPost>
      
      <HeaderDiv>
          <div className='header'>
            <Title onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }} style={{cursor:'pointer'}}>우동집</Title>
            <UlDiv>
              <li>
                {
                  user ?
                  <Link  style={{textDecoration:'none', color:'black'}} onClick={(e) => {
                    e.preventDefault();
                    signOutUser();
                  }}>로그아웃</Link>
                  : <Link to='/sign-in' style={{textDecoration:'none', color:'black'}}>로그인</Link>
                }
              </li>
              <hr style={{height: '18px', width:'1px', backgroundColor:'black', border:'none', margin:'0 3px'}}/>
              <li>
                <Link to='/sign-up' style={{textDecoration:'none', color:'black'}}>회원가입</Link>
              </li>
            </UlDiv>
          </div>
        </HeaderDiv>
      {postImgs.map((img) => {
        return (
          <img
            style={{ width: "700px", margin: "auto" }}
            key={img.id}
            src={`${supabaseUrl}/storage/v1/object/public/images/${postId}/${img.name}`}
          />
        );
      })}
      <PostInfoDetail>
        <p> 작성자: {post.PostUserName}</p>
        <p> 도시: {post.PostCity}</p>
        <p> 음식종류: {post.PostFoodType}</p>
        <p> 작성날짜: {post.PostDate}</p>
        <p> 좋아요: {JSON.parse('[]').length}</p>
      </PostInfoDetail>
      <PostContents>
        <p style={{ fontSize: "24px" }}> 제목: {post.PostTitle}</p>
        <p> 내용: {post.PostContent}</p>
      </PostContents>
      <CommentStyle>
        <Comment />
      </CommentStyle>
      {/* {post.Comments.map((comment) => {
        return (
          <CommentStyle key={comment.CommentID}>
            <p>작성자:{comment.commentUserID}</p>
            <p>작성날짜:{comment.CommentDate}</p>
            <p>내용:{comment.CommentContent}</p>
            
          </CommentStyle>
        );
      })} */}
    </DetailPost>
  );
};

export default PostDetail;

const PostInfoDetail = styled.div`
  display: flex;
  gap: 30px;
  border-bottom: 1px solid lightgrey;
`;

const PostContents = styled.div`
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const CommentStyle = styled.div`
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const DetailPost = styled.div`
  max-width: 900px; // 반응형

  display: flex;
  padding-bottom: 30px;
  line-height: 30px;
  gap: 50px;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto; // margin 0은 위아래를 0 좌우 margin을 auto 가운데 정렬에 유용
`;







const HeaderDiv = styled.header`
  background-color: white;
  width: 100%;
  height: fit-content;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 10px 0;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
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

  /* width: 100%; */
  height: fit-content;

  position:absolute;
  top:8px;
  right: 0;
  z-index: 1;

  display: flex;
  align-items: center;
  margin-top: 3px;
`