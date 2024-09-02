import React, { useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled';
import { PostContext } from '../context/PostContext';
import { useNavigate } from 'react-router-dom';

const STORAGE_NAME = 'images';

const CreateForm = ({ Modify }) => {
  const navigate = useNavigate();
  const { setPostsNumber, addPost, modifyPost, uploadImgs, deleteImgs } = useContext(PostContext);
  const { isToModify, post } = Modify;
  // console.log('createForm :',post);

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
    !isToModify ?
      { PostUserName: '어드민', PostTitle: '', PostCity: 0, PostFoodType: 0, PostContent: '', PostDate: `${year}-${month}-${date}`, PostImgs: [null, null, null, null], PostLike: 0 }
      : post
  );



  const handlePost = (e) => {
    e.preventDefault();
    console.log(writing);

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
        const newPost = { ...writing };
        setPostsNumber(prev => {
          newPost.PostID = prev;
          newPost.PostImgs = newPost.PostImgs.filter(ele => Boolean(ele));
          uploadImgs(newPost.PostID, newPost.PostImgs);
          // const tmpPost = {...newPost};
          newPost.PostImgs = newPost.PostImgs.map((_, idx) => `${prev}_${idx}`);

          addPost(newPost);
          // const n = newPost.length;
          // newPost.PostImgs = newPost.PostImgs.map((ele, idx) => {
          //   if (ele) {
          //     return `${prev}_${idx}`;
          //   } else {
          //     return null;
          //   }
          // });
          return prev + 1
        })
        // const today = new Date();
        // const year = today.getFullYear();
        // const month = ('0' + (today.getMonth() + 1)).slice(-2);
        // const date = ('0' + (today.getDate() + 1)).slice(-2);
        // const newPost = { ...writing };
        // newPost.PostImgs = newPost.PostImgs.map((ele, idx) => ele.name);


        alert('게시글이 등록되었습니다.');
        navigate('/');
      } else {
        const modify = async () => {
          const curPost = { ...writing };
          await deleteImgs(curPost.PostID);

          curPost.PostImgs = curPost.PostImgs.filter(ele => Boolean(ele));
          await uploadImgs(curPost.PostID, curPost.PostImgs);
          curPost.PostImgs = curPost.PostImgs.map((_, idx) => `${curPost.PostID}_${idx}`);
          await modifyPost(curPost);
          alert('게시글이 수정되었습니다.');
          navigate('/');
        }
        modify();
      }
    }
  }

  if (!isToModify) {
    return (
      <CreateContainer>
        <SelectDiv className='title_section'>
          <label htmlFor='title'>제목</label>
          <input id='title' placeholder='제목을 입력하세요. 최대 20자.' maxLength={20}
            onChange={(e) => {
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostTitle = e.target.value;
                return cur;
              });
            }} />
        </SelectDiv>
        <section className='select_section' style={{ width: '100%', height: '30px', display: 'flex' }}>
          <SelectDiv>
            <label htmlFor='city'>지역</label>
            <select id='city' defaultValue={0} onChange={(e) => {
              // setCity(e.target.value);
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostCity = e.target.value;
                return cur;
              });
            }}>
              <option value={0} >지역을 선택하세요</option>
              <option value={'서울'} >서울</option>
              <option value={'부산'} >부산</option>
              <option value={'강원도'} >강원도</option>
              <option value={'경기도'} >경기도</option>
              <option value={'경상도'} >경상도</option>
              <option value={'전라도'} >전라도</option>
              <option value={'제주도'} >제주도</option>
              <option value={'충청도'} >충청도</option>
            </select>
          </SelectDiv>
          <SelectDiv>
            <label htmlFor='food_type'>음식 종류</label>
            <select id='food_type' defaultValue={0} onChange={(e) => {
              // setFoodType(+e.target.value);
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostFoodType = +e.target.value;
                return cur;
              });
            }}>
              <option value={0} >종류를 선택하세요</option>
              <option value={1} >한식</option>
              <option value={2} >중식</option>
              <option value={3} >일식</option>
              <option value={4} >양식</option>
              <option value={5} >분식</option>
              <option value={6} >야식/안주</option>
              <option value={7} >카페/디저트</option>
              <option value={8} >기타</option>
            </select>

          </SelectDiv>
        </section>
        <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
        <ContentSection className='content_section'>
          <label htmlFor='content'>내용</label>
          <p><TextArea id={'content'} placeholder={'내용을 입력해주세요'}
            onChange={(e) => {
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostContent = e.target.value;
                return cur;
              });
            }} /></p>
        </ContentSection>
        <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
        <ImgSection className='img_section'>
          <label>사진</label>
          <div className='img_input_container'>
            {Array(4).fill().map((_,idx) => (
                <input type='file' key={`img_input_${idx}`}
                onChange={(e) => {
                  const newImgs = [...writing.PostImgs];
                  newImgs[idx] = e.target.files[idx];
    
                  setWriting(prev => {
                    const cur = { ...prev };
                    cur.PostImgs = newImgs;
                    return cur;
                  });
                }} />
              ))}
            {/* <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[0] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
            <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[1] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
            <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[2] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
            <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[3] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} /> */}

          </div>
        </ImgSection>
        <Button onClick={handlePost}>{isToModify ? '수정하기' : '등록하기'}</Button>
      </CreateContainer>
    )
  } else {

    return (
      <CreateContainer>
        <SelectDiv className='title_section'>
          <label htmlFor='title'>제목</label>
          <input id='title' maxLength={20} defaultValue={writing.PostTitle}
            onChange={(e) => {
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostTitle = e.target.value;
                return cur;
              });
            }} />
        </SelectDiv>
        <section className='select_section' style={{ width: '100%', height: '30px', display: 'flex' }}>
          <SelectDiv>
            <label htmlFor='city'>지역</label>
            <select id='city' defaultValue={writing.PostCity} style={{ width: '30%' }} onChange={(e) => {
              // setCity(e.target.value);
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostCity = e.target.value;
                return cur;
              });
            }}>
              <option value={0} >지역을 선택하세요</option>
              <option value={'서울'} >서울</option>
              <option value={'부산'} >부산</option>
              <option value={'강원도'} >강원도</option>
              <option value={'경기도'} >경기도</option>
              <option value={'경상도'} >경상도</option>
              <option value={'전라도'} >전라도</option>
              <option value={'제주도'} >제주도</option>
              <option value={'충청도'} >충청도</option>
            </select>
          </SelectDiv>
          <SelectDiv>
            <label htmlFor='food_type'>음식 종류</label>
            <select id='food_type' defaultValue={writing.PostFoodType} style={{ width: '30%' }} onChange={(e) => {
              // setFoodType(+e.target.value);
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostFoodType = +e.target.value;
                return cur;
              });
            }}>
              <option value={0} >종류를 선택하세요</option>
              <option value={1} >한식</option>
              <option value={2} >중식</option>
              <option value={3} >일식</option>
              <option value={4} >양식</option>
              <option value={5} >분식</option>
              <option value={6} >야식/안주</option>
              <option value={7} >카페/디저트</option>
              <option value={8} >기타</option>
            </select>
          </SelectDiv>
        </section>
        <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
        <ContentSection className='content_section'>
          <label htmlFor='content'>내용</label>
          <p><TextArea id={'content'} defaultValue={writing.PostContent}
            onChange={(e) => {
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostContent = e.target.value;
                return cur;
              });
            }} /></p>
        </ContentSection>
        <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
        <ImgSection className='img_section'>
          <label>사진 <span>(수정 시 사진을 다시 업로드해주세요.)</span></label>
          <div className='img_input_container'>
            {Array(4).fill().map((_,idx) => (
                <input type='file' key={`img_input_${idx}`}
              onChange={(e) => {
                const newImgs = [...writing.PostImgs];
                newImgs[idx] = e.target.files[idx];
  
                setWriting(prev => {
                  const cur = { ...prev };
                  cur.PostImgs = newImgs;
                  return cur;
                });
              }} />
            ))}
            {/* <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[0] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
            <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[1] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
            <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[2] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
            <input type='file' onChange={(e) => {
              const newImgs = [...writing.PostImgs];
              newImgs[3] = e.target.files[0];

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} /> */}
          </div>
        </ImgSection>
        <Button onClick={handlePost}>{isToModify ? '수정하기' : '등록하기'}</Button>
      </CreateContainer>
    )
  }
  return (
    <CreateContainer>
      <section className='title_section'>
        <label htmlFor='title'>제목</label>
        <input id='title' placeholder='제목을 입력하세요. 최대 20자.' maxLength={20} // value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }} />
      </section>
      <section className='select_section'>
        <label htmlFor='city'>지역</label>
        <select id='city' defaultValue={city} style={{ width: '30%' }} onChange={(e) => {
          setCity(+e.target.value);
        }}>
          <option value={0} >지역을 선택하세요</option>
          <option value={1} >서울</option>
          <option value={2} >부산</option>
          <option value={3} >강원도</option>
          <option value={4} >경기도</option>
          <option value={5} >경상도</option>
          <option value={6} >전라도</option>
          <option value={7} >제주도</option>
          <option value={8} >충청도</option>
        </select>
        <label htmlFor='food_type'>음식 종류</label>
        <select id='food_type' defaultValue={foodType} style={{ width: '30%' }} onChange={(e) => {
          setFoodType(+e.target.value);
        }}>
          <option value={0} >종류를 선택하세요</option>
          <option value={1} >한식</option>
          <option value={2} >중식</option>
          <option value={3} >일식</option>
          <option value={4} >양식</option>
          <option value={5} >분식</option>
          <option value={6} >야식/안주</option>
          <option value={7} >카페/디저트</option>
          <option value={8} >기타</option>
        </select>
      </section>
      <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
      <section className='content_section'>
        <label htmlFor='content'>내용</label>
        <p><textarea id={'content'} value={content}
          style={{
            width: '100%',
            height: '600px'
          }}
          onChange={(e) => {
            setContent(e.target.value);
          }} /></p>
      </section>
      <Button onClick={handlePost}>{isToModify ? '수정하기' : '등록하기'}</Button>
      <section className='img_section'>
        사진
        <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
          const img = e.target.value;
          const newImgs = [...imgs];
          newImgs[0] = img;
          setImgs(newImgs);
        }} />
        <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
          const img = e.target.value;
          const newImgs = [...imgs];
          newImgs[1] = img;
          setImgs(newImgs);
        }} />
        <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
          const img = e.target.value;
          const newImgs = [...imgs];
          newImgs[2] = img;
          setImgs(newImgs);
        }} />
        <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
          const img = e.target.value;
          const newImgs = [...imgs];
          newImgs[3] = img;
          setImgs(newImgs);
        }} />
      </section>
    </CreateContainer>
  )
}

export default CreateForm

const CreateContainer = styled.form`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`

const Button = styled.button`
  width: 100px;
  height: 40px;

  margin: auto;
  padding-bottom: 3px;

  border: 1px solid black;
  border-radius: 10px;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  overflow-y: scroll;
`

const SelectDiv = styled.div`
  width: 50%;
  height: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  label {
    width: 15%;

    text-align: center;
  }

  select {
    width: 85%;
    height: 80%;

    font-size: 15px;
  }
  
  input {
    width: 85%;
    height: 80%;

    font-size: 15px;
  }
`

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
`

const ImgSection = styled.section`
  width: 100%;
  height: 120px;
  
  display: flex;
  align-items: center;

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
`