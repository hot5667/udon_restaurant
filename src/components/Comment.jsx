import React, { useEffect, useState } from 'react';
import supabase from '../supaBasecClient';
// import uuid from 'react-uuid';

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [changeContent, setChangeContent] = useState('');
  const [isOpenWindow, setIsOpenWindow] = useState(false);
  const [testID, setTestID] = useState(0);

  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];

  console.log(formattedDate);

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
    // console.log({
    //   // CommentID: uuid(),
    //   PostIDKEY: 7,
    //   CommentContent: commentContent,
    //   CommentDate: formattedDate,
    // });
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
    setComments(comments.filter(c => c.CommentID !== Test));
  }

  //댓글 수정 코드
  async function changeComment(event) {
    const { data, error } = await supabase
      .from('Comments')
      // .select()

      .update({ CommentContent: changeContent, CommentDate: formattedDate })
      .eq('CommentID', testID);
    const filteredComment = comments.filter(c => {
      return c.Test !== testID;
    });
    console.log(data);
    console.log(filteredComment);

    setComments([...filteredComment, { CommentContent: changeContent, CommentDate: formattedDate }]);
  }

  const changeWindowState = CommentID => {
    testID === CommentID && setIsOpenWindow(!isOpenWindow);
  };

  const openChangeCommentWindow = () => {
    return (
      <form>
        <input onChange={event => setChangeContent(event.target.value)} />
        <button onClick={changeComment}>수정하기</button>
      </form>
    );
  };

  //댓글 리스트
  const commentList = comments.map(comment => {
    return (
      <ul key={comment.CommentID}>
        <li>{comment.CommentDate}</li>
        <li>{comment.CommentContent}</li>
        <button onClick={() => deleteComment(comment.Test)}>삭제</button>
        <button
          onClick={() => {
            setTestID(comment.CommentID);
          }}
        >
          수정
        </button>
        <div>{comment.CommentID === testID && openChangeCommentWindow()}</div>
      </ul>
    );
  });

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
