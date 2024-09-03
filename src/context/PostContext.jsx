import { createContext, useState, useEffect } from "react";
import supabase from "../supaBasecClient";
import { useLocation, useSearchParams } from "react-router-dom";

export const PostContext = createContext();

const STORAGE_NAME = 'images';

const PostContextProvider = ({ children }) => {
  const [postsNumber, setPostsNumber] = useState(0);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // 추가된 상태

  useEffect(() => {
    const fetchPostsNumber = async () => {
      try {
        const { data, error } = await supabase.from("Post").select("PostID");
        if (error) throw error;

        data.sort((a, b) => a.PostID - b.PostID);
        setPostsNumber(prev => (data.length > 0 ? data.at(-1).PostID + 1 : 0));
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPostsNumber();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from("Post").select("*");
      if (error) throw error;

      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const addData = async (post) => {
    try {
      const { error } = await supabase.from("Post").insert(post);
      if (error) throw error;

      console.log("Post added:", post.PostID);
    } catch (error) {
      console.error("Error adding post:", error.message);
    }
  };

  const modifyData = async (post) => {
    try {
      const { PostTitle, PostContent, PostCity, PostFoodType, PostImgs } = post;
      const { error } = await supabase.from("Post").update({ PostTitle, PostContent, PostCity, PostFoodType, PostImgs }).eq('PostID', post.PostID);
      if (error) throw error;

      console.log("Post modified:", post.PostID);
    } catch (error) {
      console.error("Error modifying post:", error.message);
    }
  };

  const uploadImgs = async (PostID, files) => {
    try {
      for (let i = 0; i < files.length; i++) {
        const { error } = await supabase
          .storage
          .from(STORAGE_NAME)
          .upload(`${PostID}/${PostID}_${i}`, files[i]);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error uploading images:", error.message);
    }
  };

  const getImgs = async (PostID) => {
    try {
      const { data, error } = await supabase
        .storage
        .from(STORAGE_NAME)
        .list(`${PostID}`);

      if (error) throw error;

      console.log('Images:', data);
    } catch (error) {
      console.error("Error getting images:", error.message);
    }
  };

  const deleteImgs = async (PostID) => {
    try {
      let { data: curData, error: getError } = await supabase
        .storage
        .from(STORAGE_NAME)
        .list(`${PostID}`);

      if (getError) throw getError;

      curData = curData.map(ele => `${PostID}/${ele.name}`);
      const { error: deleteError } = await supabase
        .storage
        .from(STORAGE_NAME)
        .remove(curData);

      if (deleteError) throw deleteError;

      console.log('Images deleted:', curData);
    } catch (error) {
      console.error("Error deleting images:", error.message);
    }
  };

  const uploadFile = async (PostID, file) => {
    try {
      const { error } = await supabase
        .storage
        .from(STORAGE_NAME)
        .upload(`${PostID}/${file.name}`, file);

      if (error) throw error;
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data: userData } = await supabase.auth.getSession();
        if (userData.session) {
          const { data, error } = await supabase.from('User').select('UserNickName').eq('UserID', userData.session.user.id);
          
          if (error) throw error;
          
          // Ensure data is an array and has at least one element
          if (Array.isArray(data) && data.length > 0) {
            setUser({ UserID: userData.session.user.id, UserNickName: data[0].UserNickName });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user session:", error.message);
        setUser(null);
      }
    };

    checkUserSession();
  }, []);

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <PostContext.Provider value={{ setPostsNumber, addPost: (newPost) => addData({ PostID: postsNumber, ...newPost }), modifyPost: (newPost) => modifyData(newPost), uploadImgs, deleteImgs, fetchPosts, posts, signOutUser, user }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostContextProvider;
