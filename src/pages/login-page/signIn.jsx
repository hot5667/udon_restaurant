import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import supabase from '../../supaBasecClient';

const SignIn = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 초기화

  // 이메일 및 비밀번호로 로그인
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userId,
        password: userPw,
      });

      if (authError) throw new Error(authError.message);

      setSuccess(`로그인 성공! JWT: ${authData.session.access_token}`);

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // GitHub 로그인 처리
  const handleGitHubSignIn = async () => {
    try {
      // GitHub 인증 URL을 통해 사용자 리다이렉션
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'user:email', // 필요한 OAuth 범위 지정
        },
      });

      if (error) throw new Error(`GitHub 로그인에 실패했습니다: ${error.message}`);

      setSuccess('GitHub 로그인 성공! 로그인 후 사용자 정보를 확인하세요.');

      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSignIn}>
        <div>
          <label>아이디 (이메일):</label>
          <input
            type="email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <div>
        <button onClick={handleGitHubSignIn}>GitHub으로 로그인</button>
      </div>
    </div>
  );
};

export default SignIn;
