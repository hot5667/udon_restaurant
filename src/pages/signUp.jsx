import React, { useState, useEffect } from 'react';
import supabase from '../supaBasecClient';
import { generateUserKey } from '../util/utils';

const SignUp = () => {
  const [userKey, setUserKey] = useState('');
  const [email, setEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const cities = ['서울', '부산', '인천', '대구'];

  useEffect(() => {
    setUserKey(generateUserKey());
  }, []);

  // 이메일 형식 유효성 검사
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ID 중복 확인
  const checkUserId = async () => {
    try {
      const { data, error, status } = await supabase
        .from('User')
        .select('*')
        .eq('UserID', email);

      if (status === 404) {
        throw new Error('테이블이 존재하지 않습니다. 테이블 이름을 확인하세요.');
      }

      if (error) {
        throw new Error(`아이디 확인 중 오류가 발생했습니다: ${error.message}`);
      }

      return data.length === 0;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // 특수문자 체크 함수
  const hasSpecialChar = (str) => /[!#$%^&*(),.?":{}|<>]/g.test(str);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidEmail(email)) {
      setError('유효한 이메일 주소를 입력하세요.');
      return;
    }

    if (!hasSpecialChar(userPw)) {
      setError('비밀번호에는 적어도 하나의 특수문자가 포함되어야 합니다.');
      return;
    }
    if (userPw.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (hasSpecialChar(userName)) {
      setError('이름에는 특수문자를 포함할 수 없습니다.');
      return;
    }

    const isIdUnique = await checkUserId();
    if (isIdUnique) {
      try {
        // Supabase 인증을 통해 회원가입
        const { user, error: authError } = await supabase.auth.signUp({
          email: email,
          password: userPw,
        });

        if (authError) {
          throw new Error(`회원가입에 실패했습니다: ${authError.message}`);
        }

        // Supabase 데이터베이스에 사용자 정보 삽입
        const { error: dbError } = await supabase.from('Membership').insert([
          {
            UserKEY: userKey,
            UserID: email,
            UserPW: userPw,  // 비밀번호는 Supabase에서 해시화 처리됨
            UserName: userName,
            UserCity: userCity,
          },
        ]);

        if (dbError) {
          throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
        } else {
          setSuccess('회원가입이 성공적으로 완료되었습니다!');
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError('이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.');
    }
  };

  const handleGitHubSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'user:email',
        },
      });

      if (error) {
        throw new Error(`GitHub 로그인에 실패했습니다: ${error.message}`);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = session;

          const email = user.email;
          const userId = user.id;

          const { error: dbError } = await supabase
            .from('User')
            .upsert({
              UserKEY: userKey,
              UserID: email,
              UserName: user.user_metadata?.name || '',
              UserCity: '',
            });

          if (dbError) {
            throw new Error(dbError.message);
          }

          setSuccess('GitHub으로 회원가입이 성공적으로 완료되었습니다!');
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'email profile',
        },
      });

      if (error) {
        throw new Error(`Google 로그인에 실패했습니다: ${error.message}`);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = session;

          const email = user.email;
          const userId = user.id;

          const { error: dbError } = await supabase
            .from('User')
            .upsert({
              UserKEY: userKey,
              UserID: email,
              UserName: user.user_metadata?.name || '',
              UserCity: '',
            });

          if (dbError) {
            throw new Error(dbError.message);
          }

          setSuccess('Google로 회원가입이 성공적으로 완료되었습니다!');
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKakaoSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
      });

      if (error) {
        throw new Error(`카카오톡 로그인에 실패했습니다: ${error.message}`);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { user } = session;

          const email = user.email;
          const userId = user.id;

          const { error: dbError } = await supabase
            .from('User')
            .upsert({
              UserKEY: userKey,
              UserID: email,
              UserName: user.user_metadata?.name || '',
              UserCity: '',
            });

          if (dbError) {
            throw new Error(dbError.message);
          }

          setSuccess('카카오톡으로 회원가입이 성공적으로 완료되었습니다!');
        }
      });
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
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">회원가입</button>
      </form>
      <div>
        <button onClick={handleGitHubSignUp}>GitHub으로 회원가입</button>
        <button onClick={handleGoogleSignUp}>Google로 회원가입</button>
        <button onClick={handleKakaoSignUp}>카카오톡으로 회원가입</button>
      </div>
    </div>
  );
};

export default SignUp;
