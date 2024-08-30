import React, { useEffect, useState } from 'react';
import supabase from '../supaBasecClient';

const FetchData = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('Post').select();
      if (error) {
        console.log('error=>', error);
      } else {
        console.log('data=>', data);
      }
      setPosts(data);
    };
    fetchData();
  }, []);

  //포스트 삭제 함수
  const deletePost = async targetId => {
    const { error } = await supabase.from('Post').delete().eq('PostID', targetId);
    if (error) {
      console.log('error=>', error);
    }
  };

  return (
    <div>
      {posts.map(post => {
        return (
          <div key={post.PostID}>
            <h3>{post.PostTitle}</h3>
            <button onClick={() => deletePost(post.PostID)}>삭제</button>
          </div>
        );
      })}
    </div>
  );
};

export default FetchData;
