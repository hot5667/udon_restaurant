import React, { useEffect, useState } from 'react';
import supabase from '../supaBasecClient';
// import uuid from 'react-uuid';

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    async function getComment() {
      let { data: Comments, error } = await supabase.from('Comments').select('*');
      setComments(Comments);
    }
    getComment();
  }, []);

  //댓글 추가 코드
  async function addComment(event) {
    event.preventDefault();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ko-CA');

    console.log(event);
    console.log({
      // CommentID: uuid(),
      PostIDKEY: 7,
      CommentContent: commentContent,
      CommentDate: formattedDate,
    });
    const { data, error } = await supabase.from('Comments').insert({
      // CommentID: uuid(),
      PostIDKEY: 7,
      CommentContent: commentContent,
      CommentDate: now,
    });
    setComments(prev => [...prev, { CommentContent: commentContent, CommentDate: formattedDate }]);
  }

  //댓글 삭제 코드
  async function deleteComment(Test) {
    const { error } = await supabase.from('Comments').delete().eq('Test', Test);
    console.log(Test);
    console.log(error);
    setComments(comments.filter(c => c.CommentID !== Test));
  }

  const commentList = comments.map(comment => {
    return (
      <ul key={comment.CommentID}>
        <li>{comment.CommentDate}</li>
        <li>{comment.CommentContent}</li>
        <button onClick={() => deleteComment(comment.Test)}>삭제</button>
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
