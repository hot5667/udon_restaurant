import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import supabase, { supabaseUrl } from "../../supaBasecClient";
import styled from '@emotion/styled';

const PostDetail = () => {
  const [searchParam] = useSearchParams();
  const postId = searchParam.get("id");

  const [samePost, setSamePost] = useState([
    {
      PostDate: "",
      PostCity: "",
      PostTitle: "",
      PostContent: "",
      Comments: [],
      PostFoodType: "",
      UserID: "",
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

  console.log(samePost);

  const [post] = samePost;
  return (
    <DetailPost>
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
      </PostInfoDetail>
      <PostContents>
        <p style={{ fontSize: "24px" }}> 제목: {post.PostTitle}</p>
        <p> 내용: {post.PostContent}</p>
      </PostContents>

      {post.Comments.map((comment) => {
        return (
          <CommentStyle key={comment.CommentID}>
            <p>작성자:{comment.commentUserID}</p>
            <p>작성날짜:{comment.CommentDate}</p>
            <p>내용:{comment.CommentContent}</p>
          </CommentStyle>
        );
      })}
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
  background-color: green;
  display: flex;
  padding-bottom: 30px;
  line-height: 30px;
  gap: 50px;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto; // margin 0은 위아래를 0 좌우 margin을 auto 가운데 정렬에 유용
`;