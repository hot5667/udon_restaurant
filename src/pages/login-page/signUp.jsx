import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supaBasecClient';
import { v4 as uuidv4 } from 'uuid';

const insertUserData = async (userID, userCity, userName, userProfile = '') => {
  try {
    const { error } = await supabase.from('User').upsert([
      {
        UserID: userID, // UUID 또는 OAuth로 받은 사용자 ID
        UserCity: userCity,
        UserNickName: userName,
        UserProfile: userProfile, // 프로필 사진 URL 기본값은 빈 문자열
      },
    ]);

    if (error) {
      throw new Error('사용자 정보를 저장하는 중 오류가 발생했습니다.');
    }

    return true; // 성공 시 true 반환
  } catch (err) {
    throw err; // 오류 발생 시 예외 던지기
  }
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async e => {
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
        // 회원가입 중 이미 존재하는 사용자의 경우에도 에러가 발생할 수 있으므로 조건 추가
        if (authError.message.includes("already registered")) {
          setError("이미 가입된 사용자입니다.");
        } else {
          throw new Error(`회원가입에 실패했습니다: ${authError.message}`);
        }
      } else if (user) {
        // UUID 생성
        const userID = uuidv4();

        // 사용자 정보를 데이터베이스에 삽입하는 함수 호출
        await insertUserData(userID, userCity, userName);

        setSuccess('회원가입이 성공적으로 완료되었습니다!');
        navigate('/profile'); // 회원가입 성공 후 프로필 페이지로 이동
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuthSignUp = async provider => {
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
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" value={userPw} onChange={e => setUserPw(e.target.value)} required />
        </div>
        <div>
          <label>이름:</label>
          <input type="text" value={userName} onChange={e => setUserName(e.target.value)} required />
        </div>
        <div>
          <label>도시:</label>
          <select value={userCity} onChange={e => setUserCity(e.target.value)} required>
            <option value="">도시를 선택하세요</option>
            <option value={'서울'}>서울</option>
            <option value={'부산'}>부산</option>
            <option value={'강원도'}>강원도</option>
            <option value={'경기도'}>경기도</option>
            <option value={'경상도'}>경상도</option>
            <option value={'전라도'}>전라도</option>
            <option value={'제주도'}>제주도</option>
            <option value={'충청도'}>충청도</option>
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