import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import "../css/main.css";

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
            className="sideLi"
            onClick={() => {
              navigate("/");
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
              <img
                className="logoImg2"
                src={logo}
                alt={`${region.name} 로고`}
              />
              <p>{region.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </SIDE_CONTAINER>
  );
};
export default SideBar;
