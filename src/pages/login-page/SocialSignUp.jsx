/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { css } from '@emotion/react';
import supabase from '../../supaBasecClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_NAME = 'Profile';

const SocialSignUp = () => {
  const [userCity, setUserCity] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userProfile, setUserProfile] = useState(null); // URL 대신 파일로 관리
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cities = ['서울', '부산', '인천', '대구'];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error('세션 정보를 가져오는 중 오류가 발생했습니다.');

        const user = sessionData.session.user;

        const { data: existingUser, error: fetchError } = await supabase
          .from('User')
          .select('*')
          .eq('UserID', user.id)
          .single();

        if (fetchError) throw new Error('사용자 정보를 가져오는 중 오류가 발생했습니다.');

        if (existingUser) {
          setUserCity(existingUser.UserCity || '');
          setUserNickName(existingUser.UserNickName || '');
          setUserProfile(existingUser.UserProfile || '');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const uploadProfilePicture = async (file, userID) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${supabaseUrl}/storage/v1/object/public/${STORAGE_NAME}/{userID}/profile.${fileExt}`;
  
    const { data, error } = await supabase.storage
      .from(STORAGE_NAME)
      .upload(filePath, file);
  
    if (error) {
      throw new Error('프로필 이미지 업로드 중 오류가 발생했습니다.');
    }
  
    const { publicURL, error: publicURLError } = supabase.storage
      .from(STORAGE_NAME)
      .getPublicUrl(filePath);
  
    if (publicURLError) {
      throw new Error('프로필 이미지 URL을 가져오는 중 오류가 발생했습니다.');
    }
  
    return publicURL;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error('세션 정보를 가져오는 중 오류가 발생했습니다.');

      const user = sessionData.session.user;
      let profileImageUrl = userProfile;

      if (userProfile instanceof File) {
        profileImageUrl = await uploadProfilePicture(userProfile, user.id);
      }

      const { error: updateError } = await supabase
        .from('User')
        .update({
          UserCity: userCity,
          UserNickName: userNickName,
          UserProfile: profileImageUrl,
        })
        .eq('UserID', user.id);

      if (updateError) throw new Error('사용자 정보를 업데이트하는 중 오류가 발생했습니다.');

      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div css={loadingStyle}>로딩 중...</div>;
  }

  return (
    <div css={containerStyle}>
      <h1 css={titleStyle}>추가 정보 입력</h1>
      {error && <p css={errorMessageStyle}>{error}</p>}
      <form onSubmit={handleSubmit} css={formStyle}>
        <div css={formGroupStyle}>
          <label css={labelStyle}>도시:</label>
          <select
            value={userCity}
            onChange={e => setUserCity(e.target.value)}
            required
            css={inputStyle}
          >
            <option value="">도시를 선택하세요</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div css={formGroupStyle}>
          <label css={labelStyle}>닉네임:</label>
          <input
            type="text"
            value={userNickName}
            onChange={e => setUserNickName(e.target.value)}
            required
            css={inputStyle}
          />
        </div>
        <div css={formGroupStyle}>
          <label css={labelStyle}>프로필 이미지:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setUserProfile(e.target.files[0])} // 파일 선택
            css={inputStyle}
          />
        </div>
        <button type="submit" css={buttonStyle}>정보 제출</button>
      </form>
    </div>
  );
};

export default SocialSignUp;

// Emotion 스타일 정의
const containerStyle = css`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const titleStyle = css`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const formStyle = css`
  display: flex;
  flex-direction: column;
`;

const formGroupStyle = css`
  margin-bottom: 15px;
`;

const labelStyle = css`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const inputStyle = css`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const buttonStyle = css`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const loadingStyle = css`
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
`;

const errorMessageStyle = css`
  color: red;
  text-align: center;
  margin-bottom: 15px;
`;
