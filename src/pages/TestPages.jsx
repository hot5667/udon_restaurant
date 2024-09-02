import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostsContext } from '../App';
import FetchData from '../components/FetchData';

const TestPages = () => {
  const navi = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navi('/detail?id=7');
        }}
      >
        상세페이지로
      </button>

      <FetchData />
    </div>
  );
};

export default TestPages;
