import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supaBasecClient';

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOutUser = async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('로그아웃 중 오류가 발생했습니다:', error.message);
      } else {
        // 로그아웃 성공 시 로그인 페이지로 리디렉션
        navigate('/sign-in');
      }
    };

    signOutUser();
  }, [navigate]);

  return <div>로그아웃 중...</div>;
};

export default SignOut;