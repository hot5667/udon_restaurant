/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import supabase from '../../supaBasecClient';
import { v4 as uuidv4 } from 'uuid';
import FormField from '../../components/FromField';
import CitySelect from '../../components/CitySelect';

const insertUserData = async (userID, userCity, userName, userNickName, userProfile = '') => {
  try {
    const { error } = await supabase.from('User').upsert([
      {
        UserID: userID,
        UserCity: userCity,
        UserName: userName,
        UserNickName: userNickName,
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

const uploadProfilePicture = async (file, userID) => {
  const folderPath = `profile_pictures/${userID}`;

  if (!file) {
    // 만약 파일이 없으면, placeholder 파일을 업로드
    const { error: folderError } = await supabase.storage
      .from('Profile')
      .upload(`${folderPath}/placeholder.txt`, new Blob(["This is a placeholder file"], { type: 'text/plain' }));

    if (folderError) {
      throw new Error(`폴더 생성에 실패했습니다: ${folderError.message}`);
    }

    return '';
  }

  const fileExt = file.name.split('.').pop(); // 파일 확장자 추출
  const fileName = `profile.${fileExt}`; // 파일 이름 설정
  const filePath = `${folderPath}/${fileName}`; // 전체 경로

  // 파일 형식과 크기 검증
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedFileTypes.includes(file.type)) {
    throw new Error('지원되지 않는 파일 형식입니다.');
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB 제한
    throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
  }

  const { data, error } = await supabase.storage
    .from('Profile')
    .upload(filePath, file); // 파일 업로드

  if (error) {
    throw error;
  }

  const { publicURL, error: publicURLError } = supabase.storage
    .from('Profile')
    .getPublicUrl(filePath); // 업로드된 파일의 퍼블릭 URL 가져오기

  if (publicURLError) {
    throw publicURLError;
  }

  return publicURL; // URL 반환
};

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userNickName, setUserNickName] = useState(''); 
  const [userCity, setUserCity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLogin, setIsLogin] = useState(false); 
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !userPw || !userName || !userNickName || !userCity) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    try {
      // Supabase Auth로 회원가입
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
        const userID = uuidv4(); // 사용자 ID 생성
        let profileImageUrl = '';

        // 프로필 이미지 업로드
        if (profileImage) {
          profileImageUrl = await uploadProfilePicture(profileImage, userID);
        } else {
          await uploadProfilePicture(null, userID);
        }

        // 사용자 데이터베이스에 저장
        await insertUserData(userID, userCity, userName, userNickName, profileImageUrl);
        setSuccess('회원가입이 성공적으로 완료되었습니다!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !userPw) {
      setError('이메일과 비밀번호를 입력하세요.');
      return;
    }

    try {
      // Supabase Auth로 로그인
      const { user, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: userPw,
      });

      if (authError) {
        throw new Error(`로그인에 실패했습니다: ${authError.message}`);
      }

      if (user) {
        setSuccess('로그인 성공!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuthSignUp = async (provider) => {
    try {
      // OAuth를 통한 회원가입
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: 'http://localhost:5173/auth/callback', // 리다이렉트 URL
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
    <div css={formContainerStyle}>
      <h1 css={titleStyle}>{isLogin ? '로그인' : '회원가입'}</h1>
      {error && <p css={errorMessageStyle}>{error}</p>}
      {success && <p css={successMessageStyle}>{success}</p>}
      <form onSubmit={isLogin ? handleSignIn : handleSignUp} css={formStyle}>
        <FormField
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FormField
          label="비밀번호"
          type="password"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
          required
        />
        {!isLogin && (
          <>
            <FormField
              label="이름"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <FormField
              label="닉네임"
              type="text"
              value={userNickName}
              onChange={(e) => setUserNickName(e.target.value)}
              required
            />
            <CitySelect
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
              required
            />
            <FormField
              label="프로필 사진"
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </>
        )}
        <button type="submit" css={buttonStyle}>
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      <div css={toggleStyle}>
        <p>{isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}</p>
        <button onClick={() => setIsLogin(!isLogin)} css={toggleButtonStyle}>
          {isLogin ? '회원가입' : '로그인'}
        </button>
      </div>
      <div css={oauthContainerStyle}>
        <button onClick={() => handleOAuthSignUp('github')} css={oauthButtonStyle}>GitHub로 {isLogin ? '로그인' : '회원가입'}</button>
        <button onClick={() => handleOAuthSignUp('google')} css={oauthButtonStyle}>Google로 {isLogin ? '로그인' : '회원가입'}</button>
        <button onClick={() => handleOAuthSignUp('kakao')} css={oauthButtonStyle}>Kakao로 {isLogin ? '로그인' : '회원가입'}</button>
      </div>
    </div>
  );
};

// CSS styles
const formContainerStyle = css`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const titleStyle = css`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
`;

const buttonStyle = css`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const toggleStyle = css`
  text-align: center;
  margin-top: 20px;
`;

const toggleButtonStyle = css`
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const oauthContainerStyle = css`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const oauthButtonStyle = css`
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const errorMessageStyle = css`
  color: red;
  text-align: center;
`;

const successMessageStyle = css`
  color: green;
  text-align: center;
`;

export default SignUpForm;