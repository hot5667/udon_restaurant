import React from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
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

const sideBar = () => {
  const navigate = useNavigate();
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
            <img className="logoImg" src={logo} />
          </li>
          <li className="sideLine"></li>
        </ul>
        <ul className="sideDiv">
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>전국</p>
          </li>

          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>서울</p>
          </li>
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>경기도</p>
          </li>
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>경상도</p>
          </li>
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>전라도</p>
          </li>
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>충청도</p>
          </li>
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>부산</p>
          </li>
          <li
            className="sideLi"
            onClick={() => {
              navigate('/');
            }}
          >
            <img className="logoImg2" src={logo} />
            <p>제주도</p>
          </li>
        </ul>
      </div>
    </SIDE_CONTAINER>
  );
};

export default sideBar;
