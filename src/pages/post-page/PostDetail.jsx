import React, { useEffect, useState } from 'react';
import FetchData from '../../components/FetchData';
import { useSearchParams } from 'react-router-dom';
import supabase, { supabaseUrl } from '../../supaBasecClient';

const PostDetail = () => {
    const [searchParam] = useSearchParams();
    const postId = searchParam.get('id');

    const [samePost, setSamePost] = useState([
        { PostDate: '', PostCity: '', PostTitle: '', PostContent: '', Comments: [], PostFoodType: '', UserID: '' },
    ]);

    const [postImgs, setPostImgs] = useState([]);

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
            {postImgs.map((img) => {
                return (
                    <img key={img.id} src={`${supabaseUrl}/storage/v1/object/public/images/${postId}/${img.name}`} />
                );
            })}

            <p> 작성날짜: {post.PostDate}</p>
            <p> 작성자: {post.PostUserName}</p>
            <p> 도시: {post.PostCity}</p>
            <p> 음식종류: {post.PostFoodType}</p>
            <p> 제목: {post.PostTitle}</p>
            <p> 내용: {post.PostContent}</p>

            {post.Comments.map((comment) => {
                return (
                    <div key={comment.CommentID}>
                        <p>작성날짜:{comment.CommentDate}</p>
                        <p>댓글내용:{comment.CommentContent}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default PostDetail;
