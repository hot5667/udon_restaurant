import React, { useEffect, useState } from "react";
import supabase from "../supaBasecClient";
import uuid from "react-uuid";
import { useSearchParams } from "react-router-dom";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [changeContent, setChangeContent] = useState("");
  const [isOpenWindow, setIsOpenWindow] = useState(false);
  const [testID, setTestID] = useState(0);
  const [profileImg, setProfileImg] = useState(null);
  const [params] = useSearchParams();
  const bringPostID = params.get("id");

  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0];

  useEffect(() => {
    async function getComment() {
      let { data: Comments, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("PostID", bringPostID);
      setComments(Comments);
    }
    getComment();
  }, []);

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);

      const { data: profile } = await supabase
        .from("User")
        .select(`UserID, UserProfile, Comments(*)`);

      console.log(profile);
      setProfileImg(profile);
    }
    getProfile();
  }, []);

  //프로필 이미지 불러오기

  //댓글 추가 코드
  async function addComment(event) {
    event.preventDefault();
    // console.log({
    //   // CommentID: uuid(),
    //   PostIDKEY: 7,
    //   CommentContent: commentContent,
    //   CommentDate: formattedDate,
    // });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("Comments").insert({
      UserID: user.id,
      PostID: bringPostID,
      CommentContent: commentContent,
      CommentFirstUpdate: now,
    });

    console.log(user);

    const { data: profile } = await supabase
      .from("User")
      .select(`UserID, UserProfile, Comments(*)`);

    console.log(profile);

    setComments((prev) => [
      ...prev,
      {
        UserID: user.id,
        CommentID: crypto.randomUUID(),
        CommentContent: commentContent,
        CommentDate: formattedDate,
      },
    ]);

    setProfileImg(profile);
  }

  console.log(profileImg);

  //댓글 삭제 코드
  async function deleteComment(id) {
    const { data, error } = await supabase
      .from("Comments")
      .delete()
      .eq("CommentID", id); //사용하는건지?
    setComments(comments.filter((c) => c.CommentID !== id));
  }

  //댓글 수정 코드
  async function changeComment(event) {
    event.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("Comments")
      // .select()

      .update({
        CommentContent: changeContent,
        CommentLastUpdate: formattedDate,
      })
      .eq("CommentID", testID)
      .select("*");
    const newComments = comments.map((c) => {
      if (c.CommentID === testID) {
        return data[0];
      } else {
        return c;
      }
    });
    console.log(newComments);

    setComments(newComments);
  }

  const openChangeCommentWindow = () => {
    return (
      <form onSubmit={changeComment}>
        <input onChange={(event) => setChangeContent(event.target.value)} />
        <button>수정하기</button>
      </form>
    );
  };

  //댓글 리스트
  const commentList = comments.map((comment) => {
    const foundUser = profileImg?.find((p) => comment.UserID === p?.UserID);

    return (
      <ul key={comment.CommentID}>
        <div>
          <img src={foundUser?.UserProfile} alt="프로필 사진" />
        </div>
        <div>
          <li>{comment.CommentDate}</li>
          <li>{comment.CommentContent}</li>
          <button onClick={() => deleteComment(comment.CommentID)}>삭제</button>
          <button
            onClick={() => {
              setTestID(comment.CommentID);
            }}
          >
            수정
          </button>
        </div>
        <div>{comment.CommentID === testID && openChangeCommentWindow()}</div>
      </ul>
    );
  });

  return (
    <>
      <form onSubmit={(event) => addComment(event)}>
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          onChange={(event) => {
            setCommentContent(event.target.value);
          }}
        />
        <button>입력</button>
      </form>
      <div>{commentList}</div>
    </>
  );
};

export default Comment;