/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import supabase from "../../supaBasecClient";
import LogoImg from "../../img/logo-simple.png";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const STORAGE_NAME = "Profile";

const SocialSignUp = () => {
  const [userCity, setUserCity] = useState("");
  const [userNickName, setUserNickName] = useState("");
  const [userProfile, setUserProfile] = useState([]); // 파일 배열로 관리
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cities = ["서울", "부산", "인천", "대구"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError)
          throw new Error("세션 정보를 가져오는 중 오류가 발생했습니다.");

        const user = sessionData.session.user;

        const { data: existingUser, error: fetchError } = await supabase
          .from("User")
          .select("*")
          .eq("UserID", user.id)
          .single();

        if (fetchError)
          throw new Error("사용자 정보를 가져오는 중 오류가 발생했습니다.");

        if (existingUser) {
          setUserCity(existingUser.UserCity || "");
          setUserNickName(existingUser.UserNickName || "");
          setUserProfile(existingUser.UserProfile || []);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const uploadImgs = async (userID, files) => {
    const fileUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const fileExt = files[i].name.split(".").pop();
        const filePath = `${userID}/profile_${i}.${fileExt}`;

        // 파일 업로드
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_NAME)
          .upload(filePath, files[i]);

        if (uploadError) throw uploadError;

        // 업로드 후 URL 가져오기
        const { publicURL, error: publicURLError } = supabase.storage
          .from(STORAGE_NAME)
          .getPublicUrl(filePath);

        if (publicURLError) throw publicURLError;

        fileUrls.push(publicURL);
      }
    } catch (error) {
      console.error("Error uploading images:", error.message);
    }

    return fileUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 현재 세션 가져오기
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError)
        throw new Error("세션 정보를 가져오는 중 오류가 발생했습니다.");

      const user = sessionData.session.user;

      // 프로필 이미지 URL 업로드
      let profileImageUrls = [];
      if (userProfile.length > 0) {
        profileImageUrls = await uploadImgs(user.id, userProfile);
      }

      // 사용자 정보 업데이트
      const { error: updateError } = await supabase
        .from("User")
        .update({
          UserCity: userCity,
          UserNickName: userNickName,
          UserProfile: profileImageUrls,
        })
        .eq("UserID", user.id);

      if (updateError)
        throw new Error("사용자 정보를 업데이트하는 중 오류가 발생했습니다.");

      // 프로필 페이지로 리다이렉트
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div css={loadingStyle}>로딩 중...</div>;
  }

  return (
    <div css={wrapperStyle}>
      <div css={containerStyle}>
        <img css={logoImg} src={LogoImg} alt="로고" />
        <h1 css={titleStyle}>추가 정보 입력</h1>
        {error && <p css={errorMessageStyle}>{error}</p>}
        <form onSubmit={handleSubmit} css={formStyle}>
          <div css={formGroupStyle}>
            <label css={labelStyle}>도시:</label>
            <select
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
              required
              css={inputStyle}
            >
              <option value="">도시를 선택하세요</option>
              {cities.map((city) => (
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
              onChange={(e) => setUserNickName(e.target.value)}
              required
              css={inputStyle}
            />
          </div>
          <div css={formGroupStyle}>
            <label css={labelStyle}>프로필 이미지:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUserProfile(Array.from(e.target.files))} // 파일 배열 선택
              css={inputStyle}
            />
          </div>
          <button type="submit" css={buttonStyle}>
            정보 제출
          </button>
        </form>
      </div>
    </div>
  );
};

export default SocialSignUp;

// Emotion 스타일 정의

const wrapperStyle = css`
  width: 100%;
  height: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const containerStyle = css`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const logoImg = css`
  width: 100px;
  height: auto;
  margin-left: 120px;
  margin-bottom: 10px;
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
  background-color: #fea100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #855c17;
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
