import React, { useContext, useEffect, useState } from "react";
import defaultProfileImg from "../../img/image.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase, { supabaseUrl } from "../../supaBasecClient";
import styled from "@emotion/styled";
import Comment from "../../components/Comment";
import { PostContext } from "../../context/PostContext";
import DeletePost from "../../components/DeletePost";

const PostDetail = () => {
  const menu = {
    1: "한식",
    2: "중식",
    3: "일식",
    4: "양식",
    5: "분식",
    6: "야식/안주",
    7: "카페/디저트",
    8: "기타",
  };

  const navigate = useNavigate();
  //객체로 받아옴
  const { user } = useContext(PostContext);
  console.log(user);

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
  const [profileImg, setProfileImg] = useState([]);

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
      // console.log(data);
      setPostImgs(data);
    };
    FindPostImg();
  }, []);

  useEffect(() => {
    const FindProfileImg = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("UserProfile")
        .eq("UserID", post.UserID);
      if (error) {
        console.log("error=>", error);
      } else {
        console.log(data);
        setProfileImg(data);
      }
    };
    FindProfileImg();
  }, [samePost]);

  console.log(samePost);

  const [post] = samePost;

  let tmp = post.PostContent;
  console.log("tmp", tmp);
  tmp = tmp.split("\n").map((line, idx) => {
    return (
      <span key={`${postId}_line_${idx}`}>
        {line}
        <br />
      </span>
    );
  });

  console.log(profileImg);
  return (
    <DetailPost>
      {postImgs.map((img) => {
        return (
          <img
            style={{ width: "700px", margin: "auto" }}
            key={img.id}
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${postId}/${img.name}`}
          />
        );
      })}
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
        {profileImg[0]?.UserProfile ? (
          <ProfileImg src={profileImg[0]?.UserProfile} />
        ) : (
          <ProfileImg src={defaultProfileImg} />
        )}
        <p> 작성자: {post.PostUserName}</p>
        <p> 도시: {post.PostCity}</p>
        <p> 음식종류: {menu[post.PostFoodType]}</p>
        <p> 작성날짜: {post.PostDate}</p>
      </PostInfoDetail>
      <PostContents>
        <p style={{ fontSize: "24px" }}> 제목: {post.PostTitle}</p>
        <p style={{ wordWrap: "break-word" }}>
          {" "}
          내용 <br />
          {tmp}
        </p>
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
  gap: 20px;
  border-bottom: 1px solid lightgrey;
`;

const PostContents = styled.div`
  line-height: 30px;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const CommentStyle = styled.div`
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
`;

const DetailPost = styled.div`
  max-width: 900px;

  display: flex;
  padding-bottom: 30px;
  line-height: 30px;
  gap: 50px;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
`;

const ButtonStyle = styled.div`
  display: flex;

  margin: 0 0 0 auto;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
`;
