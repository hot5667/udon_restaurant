import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../supaBasecClient';

const STORAGE_NAME = 'images';

const CreateForm = ({ Modify }) => {
    const navigate = useNavigate();
    const { setPostsNumber, addPost, modifyPost, uploadImgs, deleteImgs } = useContext(PostContext);
    const { isToModify, post } = Modify;
    const { user } = useContext(AuthContext);
    // console.log('createForm :',post);
    // console.log('user :', user);

    useEffect(() => {
        const getUserInfo = async () => {
            const { data: session } = await supabase.auth.getSession();
            // setUser(session?.user ?? null);
        };

        getUserInfo();
    }, []);

    // const [title, setTitle] = useState('');
    // const [city, setCity] = useState(0);
    // const [foodType, setFoodType] = useState(0);
    // const [content, setContent] = useState('');
    // const [imgs, setImgs] = useState(['', '', '', '']);

    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const date = ('0' + today.getDate()).slice(-2);
    const [writing, setWriting] = useState(
        !isToModify
            ? {
                  PostUserName: '',
                  PostTitle: '',
                  PostCity: 0,
                  PostFoodType: 0,
                  PostContent: '',
                  PostDate: `${year}-${month}-${date}`,
                  PostImgs: [null, null, null, null],
                  PostLike: '[]',
              }
            : { ...post }
    );

    const handlePost = (e) => {
        e.preventDefault();
        // console.log('writing :', writing);

        if (!writing.PostTitle) {
            alert('제목을 입력해주세요.');
            return;
        } else if (writing.PostCity === '0' || writing.PostFoodType === 0) {
            alert('지역과 음식 종류를 입력했는지 확인해주세요.');
            return;
        } else if (!writing.PostContent) {
            alert('내용을 입력해주세요.');
            return;
        } else {
            if (!isToModify) {
                // console.log('writing user :', user);
                const newPost = { ...writing, PostUserName: user?.UserNickName };
                // console.log('newPost :', newPost);
                setPostsNumber((prev) => {
                    newPost.PostID = prev;
                    newPost.PostImgs = newPost.PostImgs.filter((ele) => Boolean(ele));
                    uploadImgs(newPost.PostID, newPost.PostImgs);
                    // const tmpPost = {...newPost};
                    newPost.PostImgs = newPost.PostImgs.map((_, idx) => `${prev}_${idx}`);

                    addPost(newPost);
                    return prev + 1;
                });

                alert('게시글이 등록되었습니다.');
                navigate('/');
            } else {
                const modify = async () => {
                    const curPost = { ...writing };
                    // console.log('curPost :', curPost);
                    await deleteImgs(curPost.PostID);

                    curPost.PostImgs = curPost.PostImgs.filter((ele) => Boolean(ele));
                    await uploadImgs(curPost.PostID, curPost.PostImgs);
                    curPost.PostImgs = curPost.PostImgs.map((_, idx) => `${curPost.PostID}_${idx}`);
                    await modifyPost(curPost);
                    alert('게시글이 수정되었습니다.');
                    navigate('/');
                };
                modify();
                alert('게시글이 수정 중입니다.');
            }
        }
    };

    if (!isToModify) {
        return (
            <CreateContainer>
                <InputDiv className="title_section">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        placeholder="제목을 입력하세요. 최대 20자."
                        maxLength={20}
                        onChange={(e) => {
                            setWriting((prev) => {
                                const cur = { ...prev };
                                cur.PostTitle = e.target.value;
                                return cur;
                            });
                        }}
                    />
                </InputDiv>
                <section className="select_section" style={{ width: '100%', display: 'flex' }}>
                    <SelectDiv>
                        <label htmlFor="city">지역</label>
                        <select
                            id="city"
                            defaultValue={0}
                            onChange={(e) => {
                                // setCity(e.target.value);
                                setWriting((prev) => {
                                    const cur = { ...prev };
                                    cur.PostCity = e.target.value;
                                    return cur;
                                });
                            }}
                        >
                            <option value={0}>지역을 선택하세요</option>
                            <option value={'서울'}>서울</option>
                            <option value={'부산'}>부산</option>
                            <option value={'강원도'}>강원도</option>
                            <option value={'경기도'}>경기도</option>
                            <option value={'경상도'}>경상도</option>
                            <option value={'전라도'}>전라도</option>
                            <option value={'제주도'}>제주도</option>
                            <option value={'충청도'}>충청도</option>
                        </select>
                    </SelectDiv>
                    <SelectDiv>
                        <label htmlFor="food_type">음식 종류</label>
                        <select
                            id="food_type"
                            defaultValue={0}
                            onChange={(e) => {
                                // setFoodType(+e.target.value);
                                setWriting((prev) => {
                                    const cur = { ...prev };
                                    cur.PostFoodType = +e.target.value;
                                    return cur;
                                });
                            }}
                        >
                            <option value={0}>종류를 선택하세요</option>
                            <option value={1}>한식</option>
                            <option value={2}>중식</option>
                            <option value={3}>일식</option>
                            <option value={4}>양식</option>
                            <option value={5}>분식</option>
                            <option value={6}>야식/안주</option>
                            <option value={7}>카페/디저트</option>
                            <option value={8}>기타</option>
                        </select>
                    </SelectDiv>
                </section>
                <hr
                    style={{
                        width: '100%',
                        height: '1px',
                        border: 'none',
                        backgroundColor: '#9c9c9c',
                        margin: '30px 0',
                    }}
                />
                <ContentSection className="content_section">
                    <label htmlFor="content">내용</label>
                    <p>
                        <TextArea
                            id={'content'}
                            placeholder={'내용을 입력해주세요'}
                            onChange={(e) => {
                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostContent = e.target.value;
                                    return cur;
                                });
                            }}
                        />
                    </p>
                </ContentSection>
                <hr
                    style={{
                        width: '100%',
                        height: '1px',
                        border: 'none',
                        backgroundColor: '#9c9c9c',
                        margin: '30px 0',
                    }}
                />
                <ImgSection className="img_section">
                    <label>사진</label>
                    <div className="img_input_container">
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[0] = e.target.files[0];
                                console.log;

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[1] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[2] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[3] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                    </div>
                </ImgSection>
                <Button onClick={handlePost}>{isToModify ? '수정하기' : '등록하기'}</Button>
            </CreateContainer>
        );
    } else {
        return (
            <CreateContainer>
                <InputDiv className="title_section">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        maxLength={20}
                        defaultValue={writing.PostTitle}
                        onChange={(e) => {
                            setWriting((prev) => {
                                const cur = { ...prev };
                                cur.PostTitle = e.target.value;
                                return cur;
                            });
                        }}
                    />
                </InputDiv>
                <section className="select_section" style={{ width: '100%', display: 'flex' }}>
                    <SelectDiv>
                        <label htmlFor="city">지역</label>
                        <select
                            id="city"
                            defaultValue={writing.PostCity}
                            style={{ width: '30%' }}
                            onChange={(e) => {
                                // setCity(e.target.value);
                                setWriting((prev) => {
                                    const cur = { ...prev };
                                    cur.PostCity = e.target.value;
                                    return cur;
                                });
                            }}
                        >
                            <option value={0}>지역을 선택하세요</option>
                            <option value={'서울'}>서울</option>
                            <option value={'부산'}>부산</option>
                            <option value={'강원도'}>강원도</option>
                            <option value={'경기도'}>경기도</option>
                            <option value={'경상도'}>경상도</option>
                            <option value={'전라도'}>전라도</option>
                            <option value={'제주도'}>제주도</option>
                            <option value={'충청도'}>충청도</option>
                        </select>
                    </SelectDiv>
                    <SelectDiv>
                        <label htmlFor="food_type">음식 종류</label>
                        <select
                            id="food_type"
                            defaultValue={writing.PostFoodType}
                            style={{ width: '30%' }}
                            onChange={(e) => {
                                // setFoodType(+e.target.value);
                                setWriting((prev) => {
                                    const cur = { ...prev };
                                    cur.PostFoodType = +e.target.value;
                                    return cur;
                                });
                            }}
                        >
                            <option value={0}>종류를 선택하세요</option>
                            <option value={1}>한식</option>
                            <option value={2}>중식</option>
                            <option value={3}>일식</option>
                            <option value={4}>양식</option>
                            <option value={5}>분식</option>
                            <option value={6}>야식/안주</option>
                            <option value={7}>카페/디저트</option>
                            <option value={8}>기타</option>
                        </select>
                    </SelectDiv>
                </section>
                <hr
                    style={{
                        width: '100%',
                        height: '1px',
                        border: 'none',
                        backgroundColor: '#9c9c9c',
                        margin: '30px 0',
                    }}
                />
                <ContentSection className="content_section">
                    <label htmlFor="content">내용</label>
                    <p>
                        <TextArea
                            id={'content'}
                            defaultValue={writing.PostContent}
                            onChange={(e) => {
                                setWriting((prev) => {
                                    const cur = { ...prev };
                                    cur.PostContent = e.target.value;
                                    return cur;
                                });
                            }}
                        />
                    </p>
                </ContentSection>
                <hr
                    style={{
                        width: '100%',
                        height: '1px',
                        border: 'none',
                        backgroundColor: '#9c9c9c',
                        margin: '30px 0',
                    }}
                />
                <ImgSection className="img_section">
                    <label>
                        사진 <br/><span>(수정 시 사진을 다시 업로드해주세요.)</span>
                    </label>
                    <div className="img_input_container">
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[0] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[1] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[2] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const newImgs = [...writing.PostImgs];
                                newImgs[3] = e.target.files[0];

                                setWriting((prev) => {
                                    const cur = { ...writing };
                                    cur.PostImgs = newImgs;
                                    return cur;
                                });
                            }}
                        />
                    </div>
                </ImgSection>
                <Button onClick={handlePost}>{isToModify ? '수정하기' : '등록하기'}</Button>
            </CreateContainer>
        );
    }
};

export default CreateForm;

const CreateContainer = styled.form`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 50px;

    margin: auto;

    border: none;
    border-radius: 10px;

    background-color: #fea100;
    font-size: 16px;
    font-weight: 700;

    :hover {
        background-color: #5043ff;
        border: 2px solid #5043ff;
        color: #fff;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 100%;
    resize: none;
    overflow-y: scroll;
`;

const SelectDiv = styled.div`
    width: 50%;
    height: 45px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    label {
        width: 20%;
        height: 0px;
        text-align: center;
    }

    select {
        width: 85%;
        height: 35px;
        font-size: 15px;
        /* 유현지 css추가라인 */
        margin-top: 20px;
        appearance: none;
        padding-left: 10px;
        border: none;
        border-bottom: 2px solid #ffae00;
    }

    select:focus {
        outline: none;
        border-bottom: 2px solid #ff7083;
    }

    select option {
        border-radius: 8px;
    }
`;

const InputDiv = styled.div`
    width: 50%;
    height: 45px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    label {
        width: 20%;
        height: 10px;
        text-align: center;
    }

    input {
        width: 85%;
        height: 80%;
        font-size: 15px;
        /* 유현지 css추가라인 */
        padding: 5px;
        border: none;
        border-bottom: 2px solid #ffae00;
        padding-left: 10px;
    }

    input:focus {
        outline: none;
        border-bottom: 2px solid #ff7083;
    }
`;

const ContentSection = styled.section`
    width: 100%;
    height: 600px;

    display: flex;
    align-items: center;

    label {
        width: 7.5%;
        text-align: center;
    }

    p {
        width: 92.5%;
        height: 100%;
    }

    TextArea {
        border-radius: 20px;
        padding: 15px 5px 15px 15px;
        font-size: 15px;
        border: 1px solid #ffae00;
    }

    TextArea:focus {
        outline: 2px solid #ffae00;
        border: 1px solid #ffae00;
    }
    TextArea::-webkit-scrollbar {
        width: 16px;
    }

    TextArea::-webkit-scrollbar-thumb {
        background-color: #fea100;
        border: 2px solid #ffeac7;
        border-radius: 20px; /* 테두리의 둥글기 */
    }

    TextArea::-webkit-scrollbar-thumb:hover {
        background-color: #968fff;
        border: 2px solid #e6e4ff; /* 호버 시 thumb 색상 */
    }

    TextArea::-webkit-scrollbar-button:vertical:end:decrement {
        display: block;
        width: 10px;
    }

    TextArea::-webkit-scrollbar-button:vertical:start:increment {
        display: block;
        height: 10px;
    }
`;

const ImgSection = styled.section`
    width: 100%;
    height: 170px;

    display: flex;
    align-items: center;

    margin-bottom: 50px;

    label {
        width: 7.5%;

        text-align: center;
    }

    .img_input_container {
        width: 92.5%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
    }

    input::file-selector-button {
        background-color: #fea100;
        border-radius: 8px;
        border: 2px solid #fea100;
        padding: 5px 10px 5px 10px;
        margin: 3px 15px 3px 3px;
    }

    input::file-selector-button:hover {
        background-color: #837aff;
        border: 2px solid #837aff;
        color: #fff;
    }

    span {
        font-size: 12px;
        line-height: 0;
    }
`;