import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supaBasecClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 세션 정보를 가져옵니다.
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error('세션 정보를 가져오는 중 오류가 발생했습니다: ' + error.message);

        const session = data.session;
        if (session) {
          const user = session.user;

          // 사용자가 이미 데이터베이스에 존재하는지 확인합니다.
          const { data: existingUser, error: fetchError } = await supabase
            .from('User')
            .select('*')
            .eq('UserID', user.id);

          if (fetchError) throw new Error('사용자 존재 여부 확인 중 오류가 발생했습니다: ' + fetchError.message);

          if (existingUser.length > 0) {
            const userInfo = existingUser[0];

            // 추가 정보가 없으면 SocialSignUp 페이지로 리디렉션
            if (!userInfo.UserCity || !userInfo.UserNickName || !userInfo.UserProfile) {
              navigate('/social-sign-up');
            } else {
              navigate('/profile'); // 프로필 페이지로 리디렉션
            }
          } else {
            // 새로운 사용자일 경우, 사용자 정보를 데이터베이스에 삽입합니다.
            const { error: insertError } = await supabase.from('User').upsert([
              {
                UserID: user.id,
                UserCity: '',
                UserNickName: user.user_metadata.full_name || '', 
                UserProfile: '', 
              },
            ]);

            if (insertError) throw new Error('사용자 정보를 저장하는 중 오류가 발생했습니다: ' + insertError.message);

            navigate('/social-sign-up'); 
          }
        }
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div>
      {loading ? '로딩 중...' : errorMessage ? <p style={{ color: 'red' }}>{errorMessage}</p> : '처리 중...'}
    </div>
  );
};

export default AuthCallback;