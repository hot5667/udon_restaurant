import { createContext, useEffect, useState } from "react";
import supabase from "../supaBasecClient";

export const PostContext = createContext(null);

const STORAGE_NAME = 'images';

const PostContextProvider = ({ children }) => {
  const [postsNumber, setPostsNumber] = useState(0);
  // console.log()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Post").select("*");
      if (error) {
        throw error;
      } else {
        data.sort((a, b) => a.PostID - b.PostID)
        // console.log("data => ", data);
        setPostsNumber(prev => prev + data.at(-1).PostID + 1);
      }
    };

    fetchData();
  }, []);

  const addData = async (post) => {
    const { error } = await supabase.from("Post").insert(post);
    if (error) {
      throw error;
    } else {
      console.log("add data succeed", post.PostID);
    }

  };

  const deleteData = async (post) => {
    const { error } = await supabase.from("Post").delete().eq("PostID", post.PostID);
    if (error) {
      throw error;
    } else {
      console.log("delete data => ", data);
    }
  }

  const modifyData = async (post) => {
    console.log('modyfying :', post);
    const { PostTitle, PostContent, PostCity, PostFoodType } = post;
    const { error } = await supabase.from("Post").update({ PostTitle, PostContent, PostCity, PostFoodType }).eq('PostID', post.PostID);
    if (error) {
      throw error;
    } else {
      console.log("modify data succeed", post.PostID);
    }
  }

  const addPost = (newPost) => {
    addData({ PostID: postsNumber, ...newPost });
  }

  const deletePost = (curPost) => {
    deleteData(curPost);
  }

  const modifyPost = (newPost) => {
    modifyData(newPost);
  }

    
  const uploadImgs = async (PostID, files) => {
    for (const file of files) {
      const { data, error } = await supabase
        .storage
        .from(STORAGE_NAME)
        .upload(`${PostID}/${file.name}`, file)
      if (error) {
        throw error;
      }
    }

  }

  const getImgs = async (PostID) => {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_NAME)
      .list(`${PostID}`)
    if (error) {
      throw error;
    } else {
      // console.log('27 :', data)
      // setData(data);
    }
  }

  const deleteImgs = async (PostID, fileNames) => {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_NAME)
      .remove(fileNames.map(fileName => `${PostID}/${fileName}`))
    if (error) {
      throw error;
    } else {
      console.log('40 :', data)
      setData(data);
    }
  }

  // const STORAGE_NAME = 'images';
  const uploadFile = async (PostID, file) => {
    const { error } = await supabase
      .storage
      .from(STORAGE_NAME)
      .upload(`${PostID}/${file.name}`, file)
    if (error) {
      throw error;
    }

  }

  return (
    <PostContext.Provider value={{ setPostsNumber, addPost, modifyPost, uploadImgs, getImgs }}>
      {children}
    </PostContext.Provider>
  )
}

export default PostContextProvider;