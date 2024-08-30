import React, { useEffect, useState } from 'react';
import supabase from '../supaBasecClient';
import uuid from 'react-uuid';
// import { useSearchParams } from 'react-router-dom';

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  // const [searchParams] = useSearchParams();
  // const userId = searchParams.get('id');

  useEffect(() => {
    async function getComment() {
      let { data: Comments, error } = await supabase.from('Comments').select('*');
      setComments(Comments);
    }
    getComment();
  }, []);

  async function addComment(event) {
    event.preventDefault();
    console.log(event);
    const { data, error } = await supabase.from('Comments').insert({
      // CommentID: uuid(),
      PostIDKEY: 7,
      CommentContent: commentContent,
      // CommentDate: new Date().toString(), 데이터베이스에서
    }); //id반환
    // .select('*');
    setComments(prev => [...prev, { CommentContent: commentContent }]);
    //형변환 해야한다.
  }

  // const handleAddComment = commentContent => {
  //   const newAddComment = [
  //     ...comments,
  //     {
  //       CommentID: uuid(),
  //       // PostIDKEY: userId,
  //       CommentContent: commentContent,
  //       CommentDate: new Date().toString(),
  //     },
  //   ];
  //   setComments(newAddComment);
  //   addComment();
  // };

  const handleDeleteComment = CommentID => {
    const deletedComment = comments.filter(c => {
      return c.CommentID !== CommentID;
    });
    setComments(deletedComment);
  };

  const commentList = comments.map(comment => {
    return (
      <ul key={comment.CommentID}>
        <li>{comment.CommentDate}</li>
        <li>{comment.CommentContent}</li>
        <button onClick={() => handleDeleteComment(comment.CommentID)}>삭제</button>
        <button>수정</button>
      </ul>
    );
  });
  //form 태그 사용 , submit 액션 사용
  return (
    <>
      <form onSubmit={event => addComment(event)}>
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          onChange={event => {
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
