import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PostContext } from '../context/PostContext';
import { useNavigate } from 'react-router-dom';

const STORAGE_NAME = 'images';

const CreateForm = ({ Modify }) => {
  const navigate = useNavigate();
  const { setPostsNumber, addPost, modifyPost, uploadImgs } = useContext(PostContext);
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
  const date = ('0' + (today.getDate() + 1)).slice(-2);
  const [writing, setWriting] = useState(
    !isToModify ?
    { PostUserName: '어드민', PostTitle: '', PostCity: 0, PostFoodType: 0, PostContent: '', PostDate: `${year}-${month}-${date}`, PostImgs: ['', '', '', ''], PostLike: 0 }
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
          uploadImgs(newPost.PostID, newPost.PostImgs.filter(ele => Boolean(ele)))

          return prev + 1
        })
        // const today = new Date();
        // const year = today.getFullYear();
        // const month = ('0' + (today.getMonth() + 1)).slice(-2);
        // const date = ('0' + (today.getDate() + 1)).slice(-2);
        // const newPost = { ...writing };
        newPost.PostImgs = newPost.PostImgs.map(ele => ele.name);

        addPost(newPost);
        alert('게시글이 등록되었습니다.');
        navigate('/');
      } else {
        const curPost = { ...writing };
        curPost.PostImgs = JSON.stringify(curPost.PostImgs)
        modifyPost(curPost);
        alert('게시글이 수정되었습니다.');
        navigate('/');
      }
    }
  }

  if (!isToModify) {
    return (
      <CreateContainer>
        <section className='title_section'>
          <label htmlFor='title'>제목</label>
          <input id='title' placeholder='제목을 입력하세요. 최대 20자.' maxLength={20}
            onChange={(e) => {
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostTitle = e.target.value;
                return cur;
              });
            }} />
        </section>
        <section className='select_section'>
          <label htmlFor='city'>지역</label>
          <select id='city' defaultValue={0} style={{ width: '30%' }} onChange={(e) => {
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
          <label htmlFor='food_type'>음식 종류</label>
          <select id='food_type' defaultValue={0} style={{ width: '30%' }} onChange={(e) => {
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
        </section>
        <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
        <section className='content_section'>
          <label htmlFor='content'>내용</label>
          <p><textarea id={'content'} placeholder={'내용을 입력해주세요'}
            style={{
              width: '100%',
              height: '600px'
            }}
            onChange={(e) => {
              // setContent(e.target.value);
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostContent = e.target.value;
                return cur;
              });
            }} /></p>
        </section>
        <section className='img_section'>
          <p>사진</p>
          {/* <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
            const img = e.target.value;
            const newImgs = [...writing.PostImgs];
            newImgs[0] = img;

            setWriting(prev => {
              const cur = { ...prev };
              cur.PostImgs = newImgs;
              return cur;
            });
          }} />
          <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
            const img = e.target.value;
            const newImgs = [...writing.PostImgs];
            newImgs[1] = img;

            setWriting(prev => {
              const cur = { ...prev };
              cur.PostImgs = newImgs;
              return cur;
            });
          }} />
          <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
            const img = e.target.value;
            const newImgs = [...writing.PostImgs];
            newImgs[2] = img;

            setWriting(prev => {
              const cur = { ...prev };
              cur.PostImgs = newImgs;
              return cur;
            });
          }} />
          <input placeholder='사진을 url로 변환해서 올려주세요.' onChange={(e) => {
            const img = e.target.value;
            const newImgs = [...writing.PostImgs];
            newImgs[3] = img;

            setWriting(prev => {
              const cur = { ...prev };
              cur.PostImgs = newImgs;
              return cur;
            });
          }} /> */}
        <input type='file' onChange={(e) => {
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
          }} />
        </section>
        <Button onClick={handlePost}>{isToModify ? '수정하기' : '등록하기'}</Button>
      </CreateContainer>
    )
  } else {
    // const { isToModify, post } = Modify;
    // console.log('Modify :', Modify);
    // setTitle(post.Title);
    // setCity(post.PostCity);
    // setFoodType(post.PostFoodType);
    // setContent(post.PostContent);
    // setImgs(JSON.parse(post.PostImgs));
    // setWriting(post);

    return (
      <CreateContainer>
        <section className='title_section'>
          <label htmlFor='title'>제목</label>
          <input id='title' maxLength={20} defaultValue={writing.PostTitle}
            onChange={(e) => {
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostTitle = e.target.value;
                return cur;
              });
            }} />
        </section>
        <section className='select_section'>
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
        </section>
        <hr style={{ width: '100%', height: '1px', border: 'none', backgroundColor: 'black' }} />
        <section className='content_section'>
          <label htmlFor='content'>내용</label>
          <p><textarea id={'content'} defaultValue={writing.PostContent}
            style={{
              width: '100%',
              height: '600px',
              resize: 'none'
            }}
            onChange={(e) => {
              // setContent(e.target.value);
              setWriting(prev => {
                const cur = { ...prev };
                cur.PostContent = e.target.value;
                return cur;
              });
            }} /></p>
        </section>
        <section className='img_section'>
          사진
          <input placeholder='사진을 url로 변환해서 올려주세요.' defaultValue={writing.PostImgs[0]}
            onChange={(e) => {
              const img = e.target.value;
              const newImgs = [...writing.PostImgs];
              newImgs[0] = img;
              console.log('img0 :', newImgs[0]);

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
          <input placeholder='사진을 url로 변환해서 올려주세요.' defaultValue={writing.PostImgs[1]}
            onChange={(e) => {
              const img = e.target.value;
              const newImgs = [...writing.PostImgs];
              newImgs[1] = img;
              console.log('img1 :', newImgs[1]);

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
          <input placeholder='사진을 url로 변환해서 올려주세요.' defaultValue={writing.PostImgs[2]}
            onChange={(e) => {
              const img = e.target.value;
              const newImgs = [...writing.PostImgs];
              newImgs[2] = img;
              console.log('img2 :', newImgs[2]);

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
          <input placeholder='사진을 url로 변환해서 올려주세요.' defaultValue={writing.PostImgs[3]}
            onChange={(e) => {
              const img = e.target.value;
              const newImgs = [...writing.PostImgs];
              newImgs[3] = img;
              console.log('img3 :', writing.PostImgs[3]);

              setWriting(prev => {
                const cur = { ...prev };
                cur.PostImgs = newImgs;
                return cur;
              });
            }} />
        </section>
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