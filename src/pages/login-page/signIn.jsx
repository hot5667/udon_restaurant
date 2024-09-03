/** @jsxImportSource @emotion/react */
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supaBasecClient";
import { AuthContext } from "../../context/AuthContext";
import { css } from "@emotion/react";
import LogoImg from "../../img/logo-simple.png";

const SignIn = () => {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: userId,
          password: userPw,
        });

      if (authError) throw new Error(authError.message);

      setSuccess("로그인 성공!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          scopes: "email",
        },
      });

      if (error) throw new Error(`로그인에 실패했습니다: ${error.message}`);

      setSuccess(
        `${provider} 로그인 성공! 로그인 후 사용자 정보를 확인하세요.`
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div css={containerStyle}>
      <div css={formStyle}>
        <img css={logoImg} src={LogoImg} />
        <div css={loginTitle}>로그인</div>
        {error && <p css={errorStyle}>{error}</p>}
        {success && <p css={successStyle}>{success}</p>}
        <form onSubmit={handleSignIn}>
          <div css={inputGroupStyle}>
            <input
              id="email"
              type="email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              css={inputStyle}
              placeholder="아이디(이메일)"
            />
          </div>
          <div css={inputGroupStyle}>
            <input
              id="password"
              type="password"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              required
              css={inputStyle}
              placeholder="비밀번호"
            />
          </div>
          <button type="submit" css={buttonStyle}>
            로그인
          </button>
        </form>
        <div>
          <button
            onClick={() => handleOAuthSignIn("github")}
            css={oauthButtonStyle}
          >
            GitHub로 로그인
          </button>
          <button
            onClick={() => handleOAuthSignIn("google")}
            css={oauthButtonStyle}
          >
            Google로 로그인
          </button>
          <button
            onClick={() => handleOAuthSignIn("kakao")}
            css={oauthButtonStyle}
          >
            Kakao로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const formStyle = css`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const logoImg = css`
  width: 100px;
  height: auto;
  margin-bottom: 10px;
`;

const loginTitle = css`
  margin-bottom: 10px;
`;

const inputGroupStyle = css`
  margin-bottom: 0.3rem;
  text-align: left;
`;

const inputStyle = css`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const buttonStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #fea100;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;

  &:hover {
    background-color: #855c17;
  }
`;

const oauthButtonStyle = css`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #ddd;
  color: #333;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: #ccc;
  }
`;

const errorStyle = css`
  color: red;
`;

const successStyle = css`
  color: green;
`;

export default SignIn;
