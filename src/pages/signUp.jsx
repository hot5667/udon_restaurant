import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supaBasecClient';
import { v4 as uuidv4 } from 'uuid';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 이메일과 비밀번호 유효성 검사
    if (!email || !userPw || !userName || !userCity) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    try {
      // Supabase 인증 회원가입
      const { user, error: authError } = await supabase.auth.signUp({
        email: email,
        password: userPw,
      });

      if (authError) {
        throw new Error(`회원가입에 실패했습니다: ${authError.message}`);
      }

      // UUID 생성
      const userID = uuidv4();

      // Supabase 데이터베이스에 사용자 정보 삽입
      const { error: dbError } = await supabase.from('User').upsert([
        {
          UserID: userID, // UUID를 UserID로 사용
          UserCity: userCity,
          UserNickName: userName,
          UserProfil: '', // 프로필 사진 URL은 빈 문자열로 초기화
        },
      ]);

      if (dbError) {
        throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
      } else {
        setSuccess('회원가입이 성공적으로 완료되었습니다!');
        navigate('/profile'); // 회원가입 성공 후 프로필 페이지로 이동
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuthSignUp = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: 'http://localhost:5173/auth/callback', // 리디렉션 URL
        },
      });

      if (error) {
        throw new Error(`${provider} 로그인에 실패했습니다: ${error.message}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSignUp}>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label>이름:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>도시:</label>
          <select
            value={userCity}
            onChange={(e) => setUserCity(e.target.value)}
            required
          >
            <option value="">도시를 선택하세요</option>
            <option value="서울">서울</option>
            <option value="부산">부산</option>
            <option value="인천">인천</option>
            <option value="대구">대구</option>
          </select>
        </div>
        <button type="submit">회원가입</button>
      </form>
      <button onClick={() => handleOAuthSignUp('github')}>GitHub로 회원가입</button>
      <button onClick={() => handleOAuthSignUp('google')}>Google로 회원가입</button>
      <button onClick={() => handleOAuthSignUp('kakao')}>Kakao로 회원가입</button>
    </div>
  );
};

export default SignUp;
