import { createContext, useEffect, useState } from "react";
import supabase from "../supaBasecClient";

export const PostContext = createContext(null);

const STORAGE_NAME = 'images';

const PostContextProvider = ({ children }) => {
  const [postsNumber, setPostsNumber] = useState(0);
  const [user, setUser] = useState(null);
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

  // const deleteData = async (post) => {
  //   const { error } = await supabase.from("Post").delete().eq("PostID", post.PostID);
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log("delete data => ", data);
  //   }
  // }

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

  // const deletePost = (curPost) => {
  //   deleteData(curPost);
  // }

  const modifyPost = (newPost) => {
    modifyData(newPost);
    // deleteImgs(newPost.PostID);
  }


  const uploadImgs = async (PostID, files) => {
    for (let i = 0, n = files.length; i < n; i++) {
      const { data, error } = await supabase
        .storage
        .from(STORAGE_NAME)
        .upload(`${PostID}/${PostID}_${i}`, files[i])
      // 저장시 이름을 순서에 맞춰, 사진 중복 업로드도 허용함.
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
      console.log('27 :', data)
      // setData(data);
    }
  }

  const deleteImgs = async (PostID) => {
    let { data: curData, error: getError } = await supabase
      .storage
      .from(STORAGE_NAME)
      .list(`${PostID}`)
    if (getError) {
      throw error;
    }
    // else {
    console.log('curData :', curData)
    curData = curData.map(ele => PostID + '/' + ele.name);

    // }

    const { data, error: deleteError } = await supabase
      .storage
      .from(STORAGE_NAME)
      .remove(curData)
    if (deleteError) {
      throw deleteError;
    } else {
      console.log('delete :', data)
      // setData(data);
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
  

  useEffect(() => {
    const getUserInfo = async () => {
      const { data:userData } = await supabase.auth.getSession();
      if (userData.session) {
        // console.log(userData);

        const { data, error } = await supabase.from('User').select('UserNickName').eq('UserID', userData.session.user.id);
        // console.log(data);
        setUser({UserID:userData.session.user.id, UserNickname:data[0].UserNickName})
      } else {
        setUser(null);
      }
    }

    getUserInfo();
  },[])

  
  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error.message);
    } else {
      // 로그아웃 성공 시 로그인 페이지로 리디렉션
      // navigate('/sign-in');
      setUser(null);
    }
  };
  


  return (
    <PostContext.Provider value={{ setPostsNumber, addPost, modifyPost, uploadImgs, deleteImgs, signOutUser, user }}>
      {children}
    </PostContext.Provider>
  )
}

export default PostContextProvider;