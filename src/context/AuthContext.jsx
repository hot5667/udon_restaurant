import React, { createContext, useState, useEffect } from 'react';
import supabase from '../supaBasecClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태를 추가합니다.

  useEffect(() => {
    const fetchUserSession = async () => {
      setLoading(true); // 세션을 가져오기 시작할 때 로딩 상태를 true로 설정합니다.
      try {
        // 현재 세션을 가져옵니다.
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // 세션이 있는 경우 사용자 정보를 가져옵니다.
          const { data, error } = await supabase.from('User').select('UserNickName').eq('UserID', session.user.id);
          if (error) {
            console.error('사용자 정보 가져오기 오류:', error.message);
            setUser(null);
          } else {
            setUser({
              UserID: session.user.id,
              UserNickName: data[0]?.UserNickName || '알 수 없음'
            });
          }
        } else {
          // 세션이 없는 경우 사용자 상태를 null로 설정합니다.
          setUser(null);
        }
      } catch (error) {
        console.error('사용자 세션 가져오기 오류:', error.message);
        setUser(null);
      } finally {
        setLoading(false); // 세션 가져오기가 끝나면 로딩 상태를 false로 설정합니다.
      }
    };

    fetchUserSession();

    // 인증 상태 변경 리스너를 설정합니다.
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        fetchUserSession(); // 세션이 있는 경우 사용자 세션을 다시 가져옵니다.
      } else {
        setUser(null); // 세션이 없는 경우 사용자 상태를 null로 설정합니다.
      }
    });

    // 컴포넌트가 언마운트 될 때 리스너를 해제합니다.
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null); // 로그아웃 후 사용자 상태를 null로 설정합니다.
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
