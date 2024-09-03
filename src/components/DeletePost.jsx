import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import supabase from "../supaBasecClient";

const DeletePost = ({ id }) => {
  const navigate = useNavigate();
  const deletePost = async () => {
    const { error } = await supabase.from("Post").delete().eq("PostID", id);
    if (error) {
      console.log("error=>", error);
    } else {
      alert("삭제되었습니다");
      navigate("/");
    }
  };
  return <button onClick={deletePost}>게시글 삭제</button>;
};

export default DeletePost;
