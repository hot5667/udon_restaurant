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

// Function to handle the upload of a profile picture
const uploadProfilePicture = async (file, userID) => {
  // Create a folder for the user based on their UUID
  const folderPath = `profile_pictures/${userID}`;

  // Check if the file exists (i.e., the user has uploaded a profile picture)
  if (!file) {
    // If no file is provided, create an empty folder for the user
    const { error: folderError } = await supabase.storage
      .from('Profile') // Ensure the correct bucket name
      .upload(`${folderPath}/placeholder.txt`, new Blob(["This is a placeholder file"], { type: 'text/plain' }));

    if (folderError) {
      throw new Error(`폴더 생성에 실패했습니다: ${folderError.message}`);
    }

    // Since no profile image was uploaded, return an empty string or a default profile URL
    return '';
  }

  // Continue with file upload logic if a file is provided
  const fileExt = file.name.split('.').pop();
  const fileName = `profile.${fileExt}`;
  const filePath = `${folderPath}/${fileName}`;

  // Validate file type and size (example: allow only images and limit size to 5MB)
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedFileTypes.includes(file.type)) {
    throw new Error('지원되지 않는 파일 형식입니다.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('파일 크기는 5MB를 초과할 수 없습니다.');
  }

  // Upload the file to the user's folder
  const { data, error } = await supabase.storage
    .from('Profile')
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Get the public URL of the uploaded file
  const { publicURL, error: publicURLError } = supabase.storage
    .from('Profile')
    .getPublicUrl(filePath);

  if (publicURLError) {
    throw publicURLError;
  }

  return publicURL; // Return the public URL of the uploaded profile image
};

// SignUpForm component for user registration and login
const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userNickName, setUserNickName] = useState(''); // Added for nickname
  const [userCity, setUserCity] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and sign-up
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
        let profileImageUrl = '';

        if (profileImage) {
          // If a profile image is uploaded, handle the upload and get the URL
          profileImageUrl = await uploadProfilePicture(profileImage, userID);
        } else {
          // If no profile image, create a folder for the user
          await uploadProfilePicture(null, userID);
        }

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
              label="닉네임" // Nickname field
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
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const buttonStyle = css`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const oauthContainerStyle = css`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const oauthButtonStyle = css`
  background-color: #f0f0f0;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  flex-grow: 1;
  margin-right: 10px;

  &:last-of-type {
    margin-right: 0;
  }

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

const toggleStyle = css`
  margin-top: 10px;
  text-align: center;
`;

const toggleButtonStyle = css`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;

export default SignUpForm;