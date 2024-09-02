import React from 'react';

const DeletePost = () => {
  const deletePost = async targetId => {
    const { error } = await supabase.from('Post').delete().eq('PostID', targetId);
    if (error) {
      console.log('error=>', error);
    }
  };
  return <div><button onClick={() => deletePost()}>포스트 삭제</button></div>;
};

export default DeletePost;
