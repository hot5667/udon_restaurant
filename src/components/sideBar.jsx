import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import '../css/main.css';
import addPostIcon from '../img/add-post-icon.svg'
import { AuthContext } from '../context/AuthContext';

const SIDE_CONTAINER = styled.div`
  position: fixed;
  top:0;
  left:0;

  height: 100%;
  background-color: #fea100;
  width: 90px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 3;
  overflow: hidden;
  float: left;
`;

const SideBar = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

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
          <img src={addPostIcon} />
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

  img {
    width: 25px;
  }
`
