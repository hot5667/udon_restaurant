import React, { useEffect, useState } from 'react';
import FetchData from '../components/FetchData';
import { useSearchParams } from 'react-router-dom';
import supabase from '../supaBasecClient';

const PostDetail = () => {
  const [searchParam] = useSearchParams();
  const postId = searchParam.get('id');

  //promise 공부 - 캡틴~~, 강의듣고 여기에 적용해보기.
  // 여기서 공부해야할 키워드가 뭔지 물어보기

  const [samePost, setSamePost] = useState([
    { PostDate: '', PostCity: '', PostTitle: '', PostContent: '', Comments: [], PostFoodType: '', UserID: '' },
  ]);

  const [postImgs, setPostImgs] = useState([]);

  //이렇게 두는 이유!! 첨에 렌더링 될때는 값이 들어가기 전이다. 만약 빈배열을 초기값으로 둔다면 첨에 렌더링 할 때 빈 배열에 map을 돌리고
  // 빈배열의.PostDate 이런걸 찾을거냐? 이러니까 오류나지
  // 오케이 그럼 요소를 구성하는 방식은 알겠어 왜 배열 안에 넣냐?
  // 슈퍼베이스가 배열을 전달하고 있으니까 배열로 받는거다 (항상 배열로 주는 건 아니고 객체로 줄 때도 있다 상황에 따라 보고 적절한 걸 준다)
  // 참고로 그래서 return 할때도 배열의 0번째를 그리거나, 구조분해할당으로 처리
  //   그래서 배열의 0번째의 postTitle 접근해야하는데 구조분해할당써줘서 더욱 깔끔하게 구현 - const [post] = samePost;

  useEffect(() => {
    const FindSamePost = async () => {
      const { data, error } = await supabase.from('Post').select('*, Comments (*)').eq('PostID', postId);
      if (error) {
        console.log('error=>', error);
      } else {
        console.log(data);
        setSamePost(data);
      }
    };
    FindSamePost();
  }, []);

  useEffect(() => {
    const FindPostImg = async () => {
      const { data, error } = await supabase.storage.from('images').list(postId);
      if (error) {
        console.log(error);
      } else {
        data;
      }
      console.log(data);
      setPostImgs(data);
    };
    FindPostImg();
  }, []);

  console.log(samePost);

  const [post] = samePost;
  return (
    <div>
      {postImgs.map(img => {
        return <img key={img.id} src={img.name} />;
      })}
      <p> 작성날짜: {post.PostDate}</p>
      <p> 작성자: {post.UserID}</p>
      <p> 도시: {post.PostCity}</p>
      <p> 음식종류: {post.PostFoodType}</p>
      <p> 제목: {post.PostTitle}</p>
      <p> 내용: {post.PostContent}</p>
      {/* // 한포스트에 달린 댓글은 여러개니까 배열로 온다. 그래서 map 돌려줘야함 */}
      {post.Comments.map(comment => {
        return (
          <div key={comment.CommentID}>
            {/* key를 postID로 해놓으면 겹침. 유니크한걸로 ID 지정해줘야함 */}
            <p>작성날짜:{comment.CommentDate}</p>
            <p>댓글내용:{comment.CommentContent}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PostDetail;
