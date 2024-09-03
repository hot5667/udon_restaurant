import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supaBasecClient';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 쿠키에서 사용자 정보를 읽어오는 함수
  const fetchUserFromCookie = () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // 세션이 있는 경우 쿠키에 사용자 정보를 저장
          const { data, error } = await supabase.from('User').select('UserNickName').eq('UserID', session.user.id);
          if (error) {
            console.error('사용자 정보 가져오기 오류:', error.message);
            setUser(null);
          } else {
            const userInfo = {
              UserID: session.user.id,
              UserNickName: data[0]?.UserNickName || '알 수 없음'
            };
            Cookies.set('user', JSON.stringify(userInfo), { expires: 1 }); // 쿠키를 1일 동안 유효하게 설정
            setUser(userInfo);
          }
        } else {
          Cookies.remove('user');
          setUser(null);
        }
      } catch (error) {
        console.error('사용자 세션 가져오기 오류:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // 페이지 로드 시 쿠키에서 사용자 정보를 가져옴
    const cookieUser = fetchUserFromCookie();
    if (cookieUser) {
      setUser(cookieUser);
      setLoading(false);
    } else {
      fetchUserSession();
    }

    // 인증 상태 변경 리스너 설정
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        fetchUserSession();
      } else {
        Cookies.remove('user');
        setUser(null);
      }
    });

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Cookies.remove('user');
      setUser(null);
    } catch (error) {
      console.error('로그아웃 오류:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};