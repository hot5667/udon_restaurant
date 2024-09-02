import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import '../css/main.css';

const SIDE_CONTAINER = styled.div`
  position: fixed;
  height: 100%;
  background-color: #fea100;
  width: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 300;
  overflow: hidden;
  float: left;
`;

const SideBar = () => {
  const navigate = useNavigate();
  const regions = [
    { name: '전국', path: '/' },
    { name: '서울', path: '/' },
    { name: '경기도', path: '/' },
    { name: '경상도', path: '/' },
    { name: '전라도', path: '/' },
    { name: '충청도', path: '/' },
    { name: '부산', path: '/' },
    { name: '제주도', path: '/' },
  ];
  return (
    <SIDE_CONTAINER>
      <div>
        <ul className="sideDiv">
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg" src={logo} alt="logo" />
          </li>
          <li className="sideLine"></li>
        </ul>
        <ul className="sideDiv">
          {regions.map((region, index) => (
            <li
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
    </SIDE_CONTAINER>
  );
};
export default SideBar;
