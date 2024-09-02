import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supaBasecClient';
import { v4 as uuidv4 } from 'uuid';
import FormField from '../../components/FromField';
import CitySelect from '../../components/CitySelect';

const insertUserData = async (userID, userCity, userName, userProfile = '') => {
  try {
    const { error } = await supabase.from('User').upsert([
      {
        UserID: userID,
        UserCity: userCity,
        UserNickName: userName,
        UserProfile: userProfile,
      },
    ]);

    if (error) {
      throw new Error('사용자 정보를 저장하는 중 오류가 발생했습니다.');
    }

    return true;
  } catch (err) {
    throw err;
  }
};

const SignUpForm = () => {
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

    if (!email || !userPw || !userName || !userCity) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    try {
      const { user, error: authError } = await supabase.auth.signUp({
        email: email,
        password: userPw,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('이미 가입된 사용자입니다.');
        } else {
          throw new Error(`회원가입에 실패했습니다: ${authError.message}`);
        }
      } else if (user) {
        const userID = uuidv4();
        await insertUserData(userID, userCity, userName);
        setSuccess('회원가입이 성공적으로 완료되었습니다!');
        navigate('/profile');
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
          redirectTo: 'http://localhost:5173/auth/callback',
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
        <FormField
          label="이메일"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <FormField
          label="비밀번호"
          type="password"
          value={userPw}
          onChange={e => setUserPw(e.target.value)}
          required
        />
        <FormField
          label="이름"
          type="text"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          required
        />
        <CitySelect
          value={userCity}
          onChange={e => setUserCity(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>
      <div>
        <button onClick={() => handleOAuthSignUp('github')}>GitHub로 회원가입</button>
        <button onClick={() => handleOAuthSignUp('google')}>Google로 회원가입</button>
        <button onClick={() => handleOAuthSignUp('kakao')}>Kakao로 회원가입</button>
      </div>
    </div>
  );
};

export default SignUpForm;
