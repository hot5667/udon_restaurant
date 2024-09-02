import React, { useEffect, useState } from 'react';
import FetchData from '../../components/FetchData';
import { useSearchParams } from 'react-router-dom';
import supabase from '../../supaBasecClient';

const PostDetail = () => {
  const [searchParam] = useSearchParams();
  const postId = searchParam.get('id');

  const [samePost, setSamePost] = useState([{ PostImgs: '', PostDate: '', PostTitle: '', PostContent: '' }]);

  useEffect(() => {
    const FindSamePost = async () => {
      const { data, error } = await supabase.from('Post').select().eq('PostID', postId);
      if (error) {
        console.log('error=>', error);
      } else {
        'data=>', data;
      }

      setSamePost(data);
    };
    FindSamePost();
  }, []);

  console.log(samePost);

  const [post] = samePost;
  return (
    <div>
      <img src={post.PostImgs} />
      <p> 작성날짜: {post.PostUserName}</p>
      <p> 작성날짜: {post.PostDate}</p>
      <p> 도시: {post.PostCity}</p>
      <p> 음식종류: {post.PostFoodType}</p>
      <p> 제목: {post.PostTitle}</p>
      <p> 내용: {post.PostContent}</p>
    </div>
  );
};

export default PostDetail;
