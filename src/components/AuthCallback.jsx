import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supaBasecClient';
import { v4 as uuidv4 } from 'uuid';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      // 세션 정보를 가져옵니다.
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('세션 정보를 가져오는 중 오류가 발생했습니다:', error.message);
        setLoading(false);
        return;
      }

      const session = data.session;

      if (session) {
        const user = session.user;

        // 사용자가 이미 데이터베이스에 존재하는지 확인합니다.
        const { data: existingUser, error: fetchError } = await supabase
          .from('User')
          .select('*')
          .eq('UserID', user.id);

        if (fetchError) {
          console.error('사용자 존재 여부 확인 중 오류가 발생했습니다:', fetchError.message);
          setLoading(false);
          return;
        }

        if (existingUser.length > 0) {
          // 사용자가 이미 존재하는 경우
          navigate('/already-registered'); // '이미 가입된 사용자' 페이지로 리디렉션
        } else {
          // 새로운 사용자일 경우, 사용자 정보를 데이터베이스에 삽입합니다.
          const { error: insertError } = await supabase.from('User').upsert([
            {
              UserID: user.id, // Supabase에서 받은 사용자 ID
              UserCity: '', // 기본값 또는 사용자가 선택한 도시
              UserNickName: user.user_metadata.full_name || '', // 사용자 메타데이터에서 받은 이름
              UserProfil: '', // 기본값 또는 추후 업데이트
            },
          ]);

          if (insertError) {
            console.error('사용자 정보를 저장하는 중 오류가 발생했습니다:', insertError.message);
            setLoading(false);
            return;
          } else {
            navigate('/profile'); // 새로운 사용자의 경우 프로필 페이지로 리디렉션
          }
        }
      }
      setLoading(false);
    };

    handleAuth();
  }, [navigate]);

  return <div>{loading ? '로딩 중...' : '처리 중...'}</div>;
};

export default AuthCallback;