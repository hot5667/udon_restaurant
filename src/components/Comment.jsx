import React, { useEffect, useState } from 'react';
import supabase from '../supaBasecClient';
import uuid from 'react-uuid';
import { useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import '../css/font.css';

const Comment = () => {
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [changeContent, setChangeContent] = useState('');
    const [isOpenWindow, setIsOpenWindow] = useState(false);
    const [testID, setTestID] = useState(0);
    const [profileImg, setProfileImg] = useState(null);
    const [params] = useSearchParams();
    const bringPostID = params.get('id');

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];

    useEffect(() => {
        async function getComment() {
            let { data: Comments, error } = await supabase.from('Comments').select('*').eq('PostID', bringPostID);
            setComments(Comments);
        }
        getComment();
    }, []);

    useEffect(() => {
        async function getProfile() {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            console.log(user);

            const { data: profile } = await supabase.from('User').select(`UserID, UserProfile, Comments(*)`);

            console.log(profile);
            setProfileImg(profile);
        }
        getProfile();
    }, []);

    //프로필 이미지 불러오기

    //댓글 추가 코드
    async function addComment(event) {
        event.preventDefault();
        // console.log({
        //   // CommentID: uuid(),
        //   PostIDKEY: 7,
        //   CommentContent: commentContent,
        //   CommentDate: formattedDate,
        // });

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase.from('Comments').insert({
            UserID: user.id,
            PostID: bringPostID,
            CommentContent: commentContent,
            CommentFirstUpdate: now,
        });

        console.log(user);

        const { data: profile } = await supabase.from('User').select(`UserID, UserProfile, Comments(*)`);

        console.log(profile);

        setComments((prev) => [
            ...prev,
            {
                UserID: user.id,
                CommentID: crypto.randomUUID(),
                CommentContent: commentContent,
                CommentDate: formattedDate,
            },
        ]);

        setProfileImg(profile);
    }

    console.log(profileImg);

    //댓글 삭제 코드
    async function deleteComment(id) {
        const { data, error } = await supabase.from('Comments').delete().eq('CommentID', id); //사용하는건지?
        setComments(comments.filter((c) => c.CommentID !== id));
    }

    //댓글 수정 코드
    async function changeComment(event) {
        event.preventDefault();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('Comments')
            // .select()

            .update({
                CommentContent: changeContent,
                CommentLastUpdate: formattedDate,
            })
            .eq('CommentID', testID)
            .select('*');
        const newComments = comments.map((c) => {
            if (c.CommentID === testID) {
                return data[0];
            } else {
                return c;
            }
        });
        console.log(newComments);

        setComments(newComments);
    }

    const openChangeCommentWindow = () => {
        return (
            <form onSubmit={changeComment}>
                <input onChange={(event) => setChangeContent(event.target.value)} />
                <button>수정하기</button>
            </form>
        );
    };

    //댓글 리스트
    const commentList = comments.map((comment) => {
        const foundUser = profileImg?.find((p) => comment.UserID === p?.UserID);

        return (
            <ul key={comment.CommentID}>
                <div>
                    <img src={foundUser?.UserProfile} alt="프로필 사진" />
                </div>
                <div>
                    <li>{comment.CommentDate}</li>
                    <li>{comment.CommentContent}</li>
                    <button onClick={() => deleteComment(comment.CommentID)}>삭제</button>
                    <button
                        onClick={() => {
                            setTestID(comment.CommentID);
                        }}
                    >
                        수정
                    </button>
                </div>
                <div>{comment.CommentID === testID && openChangeCommentWindow()}</div>
            </ul>
        );
    });

    return (
        <CommentInputMain>
            <CommentInput onSubmit={(event) => addComment(event)}>
                <TextArea
                    type="text"
                    placeholder="댓글을 입력해주세요"
                    onChange={(event) => {
                        setCommentContent(event.target.value);
                    }}
                />
                <button>댓글등록</button>
            </CommentInput>
            <div>{commentList}</div>
        </CommentInputMain>
    );
};

export default Comment;

const CommentInput = styled.form`
    width: 100%;
`;

const CommentInputMain = styled.div`
    width: 100%;

    margin-bottom: 20px;

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 110px;
        height: 40px;

        border: none;
        border-radius: 30px;

        margin-left: auto;

        background-color: #fea100;
        font-size: 14px;
        font-weight: 700;

        color: #fff;
    }
    button:hover {
        background-color: #5043ff;
        border: 2px solid #5043ff;
        color: #fff;
    }
`;

const TextArea = styled.textarea`
    font-family: 'GmarketSansMedium';
    padding: 15px 5px 15px 15px;
    width: 100%;
    height: 100px;
    resize: none;
    overflow-y: scroll;

    border: 2.5px solid #fea100;
    border-radius: 15px;

    :focus {
        outline: 2px solid #ffae00;
        border: 1px solid #ffae00;
    }
    ::-webkit-scrollbar {
        width: 16px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #fea100;
        border: 2px solid #ffeac7;
        border-radius: 20px; /* 테두리의 둥글기 */
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #968fff;
        border: 2px solid #e6e4ff; /* 호버 시 thumb 색상 */
    }

    ::-webkit-scrollbar-button:vertical:end:decrement {
        display: block;
        width: 10px;
    }

    ::-webkit-scrollbar-button:vertical:start:increment {
        display: block;
        height: 10px;
    }
`;
