import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import '../css/main.css';
import { PostContext } from '../context/PostContext';

const SIDE_CONTAINER = styled.div`
  position: fixed;
  top:0;
  left:0;

  height: 100%;
  background-color: #fea100;
  width: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 3;
  overflow: hidden;
  float: left;
`;

const SideBar = () => {
  const navigate = useNavigate();
  const {user} = useContext(PostContext);

  const regions = [
    { name: '전국', path: '/post-list' },
    { name: '서울', path: '/post-list?city=서울' },
    { name: '부산', path: '/post-list?city=부산' },
    { name: '경기도', path: '/post-list?city=경기도' },
    { name: '경상도', path: '/post-list?city=경상도' },
    { name: '전라도', path: '/post-list?city=전라도' },
    { name: '충청도', path: '/post-list?city=충청도' },
    { name: '제주도', path: '/post-list?city=제주도' },
  ];
  return (
    <SIDE_CONTAINER>
      <div>
        <ul className="sideDiv">
          <li
            className="sideLi">
            <img className="logoImg" src={logo} alt="logo" style={{cursor:'pointer'}}
            onClick={() => {
              navigate('/');
            }}
          />
          </li>
          <li className="sideLine"></li>
        </ul>
        <ul className="sideDiv">
          {regions.map((region, index) => (
            <li style={{cursor:'pointer'}}
              key={index}
              className="sideLi"
              onClick={() => {
                navigate(region.path);
              }}
            >
              <img className="logoImg2" src={logo} alt={`${region.name} 로고`} />
              <p>{region.name}</p>
            </li>
          ))}
        </ul>
      </div>
      
      <AddPostButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (user) {
              navigate('/create');
            } else {
              alert('로그인해야 게시글 작성이 가능합니다.')
              return;
            }

          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="#ffffff" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/>
          </svg>
        </AddPostButton>
    </SIDE_CONTAINER>
  );
};
export default SideBar;


const AddPostButton = styled.button`
  width:50px;
  height:50px;

  border: none;
  border-radius: 50px;
  background-color: #fea100;

  position: fixed;
  bottom: 20px;
  right: 30px;

  &:hover {
    background-color: #dc8b00;
  }

  svg {
    width: 25px;
  }
`