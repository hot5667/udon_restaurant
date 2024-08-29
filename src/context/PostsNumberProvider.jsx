import { createContext, useEffect, useState } from "react";
import supabase from "../supaBasecClient";

export const PostsNumberContext = createContext(null);

const PostsNumberProvider = ({ children }) => {
  const [postsNumber, setPostsNumber] = useState(0); // 기본 두 개가 등록되어 있어서 1
  console.log()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Post").select("*");
      if (error) {
        throw error;
      } else {
        // console.log("data => ", data);
        setPostsNumber(prev => prev + data.at(-1).PostID+1);
      }
    };

    fetchData();
  }, []);

  const addData = async (post) => {
    const { data, error } = await supabase.from("Post").insert(post);
    if (error) {
      throw error;
    } else {
      console.log("add data => ", data);
    }
  };

  const deleteData = async (post) => {
    const { data, error } = await supabase.from("Post").delete().eq('PostId', post.PostID);
    if (error) {
      throw error;
    } else {
      console.log("delete data => ", data);
    }
  }

  const modifyData = async (post) => {
    const { PostTitle, PostContent, PostCity, PostFoodType } = post;
    const { data, error } = await supabase.from("Post").update({ PostTitle, PostContent, PostCity, PostFoodType }).eq('PostId', post.PostID);
    if (error) {
      throw error;
    } else {
      console.log("modify data => ", data);
    }
  }

  const addPost = (newPost) => {
    addData({PostID:postsNumber,...newPost});
  }

  const deletePost = (curPost) => {
    deleteData(curPost);
  }

  const modifyPost = (newPost) => {
    modifyData(newPost);
  }

  return (
    <PostsNumberContext.Provider value={{ setPostsNumber, addPost, modifyPost }}>
      {children}
    </PostsNumberContext.Provider>
  )
}

export default PostsNumberProvider;