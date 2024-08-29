import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { PostsNumberContext } from '../context/PostsNumberProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../supaBasecClient';

const CreateForm = ({isToModify, ID}) => {
  const navigate = useNavigate();
  const { setPostsNumber, addPost, modifyPost } = useContext(PostsNumberContext);

  const [title, setTitle] = useState('');
  const [city, setCity] = useState(0);
  const [foodType, setFoodType] = useState(0);
  const [content, setContent] = useState('');
  const [imgs, setImgs] = useState(['', '', '', '']);

  const handlePost = (e) => {
    e.preventDefault();
    console.log(city, foodType);
    if (!title) {
      alert('제목을 입력해주세요.');
      return;
    } else if (city === 0 || foodType === 0) {
      alert('지역과 음식 종류를 입력했는지 확인해주세요.');
      return;
    } else if (!content) {
      alert('내용을 입력해주세요.');
      return;
    } else {
      if (!isToModify) {
        setPostsNumber(prev => prev + 1)
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const date = ('0' + (today.getDate() + 1)).slice(-2);
        const newPost = { PostUserName:'어드민',PostTitle: title, PostCity: city, PostFoodType: foodType, PostContent: content, PostDate: `${year}-${month}-${date}`, PostImgs: JSON.stringify(imgs), PostLike: 0 };
        addPost(newPost);
        alert('게시글이 등록되었습니다.');
        navigate('/');
      } else {
        const curPost = { PostID: ID, PostTitle: title, PostCity: city, PostFoodType: foodType, PostContent: content, PostImgs: imgs };
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
              setTitle(e.target.value);
            }} />
        </section>
        <section className='select_section'>
          <label htmlFor='city'>지역</label>
          <select id='city' defaultValue={0} style={{ width: '30%' }} onChange={(e) => {
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
          <select id='food_type' defaultValue={0} style={{ width: '30%' }} onChange={(e) => {
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
          <p><textarea id={'content'} placeholder={'내용을 입력해주세요'}
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
  } else {
    
    useEffect(() => {
      const fetchData = async () => {
        const { data, error } = await supabase.from("Post").select("*").eq('PostID',ID);
        if (error) {
          throw error;
        } else {
          console.log("data => ", data);
          setTitle(data.PostTitle);
          setCity(data.PostCity);
          setFoodType(data.PostFoodType);
          setContent(data.PostContent);
          setImgs(data.PostImgs);
        }
      };
  
      fetchData();
    }, []);

    const getTitle = async () => {
      console.log('title :',title);
      return title;
    }
    const getCity = async () => {
      console.log(city);
      return city;
    }
    const getFoodType = async () => {
      console.log(foodType);
      return foodType;
    }
    const getContent = async () => {
      console.log(content);
      return content;
    }
    const getImgs = async () => {
      console.log(imgs);
      return imgs;
    }

    return (
      <CreateContainer>
        <section className='title_section'>
          <label htmlFor='title'>제목</label>
          <input id='title' maxLength={20} value={title}
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