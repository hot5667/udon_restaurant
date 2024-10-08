/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import supabase from "../../supaBasecClient";
import FormField from "../../components/FromField";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [userPw, setUserPw] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // 로그인/회원가입 토글
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !userPw || !userName) {
      setError("모든 필드를 입력하세요.");
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: userPw,
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("이미 가입된 사용자입니다.");
        } else {
          throw new Error(`회원가입에 실패했습니다: ${authError.message}`);
        }
        return;
      }

      if (data.user) {
        setSuccess("회원가입이 성공적으로 완료되었습니다!");
        navigate("/social-sign-up");
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
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: userPw,
      });

      if (authError) {
        throw new Error(`로그인에 실패했습니다: ${authError.message}`);
      }

      if (data.user) {
        setSuccess("로그인 성공!");
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw new Error(`소셜 회원가입에 실패했습니다: ${error.message}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div css={WrappedContainer}>
      <div css={formContainerStyle}>
        <h1 css={titleStyle}>{isLogin ? "로그인" : "회원가입"}</h1>
        {error && <p css={errorMessageStyle}>{error}</p>}
        {success && <p css={successMessageStyle}>{success}</p>}
        <form onSubmit={isLogin ? handleSignIn : handleSignUp} css={formStyle}>
          {!isLogin && (
            <div css={socialLoginContainerStyle}>
              <FormField
                label="이름"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
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
              <button onClick={() => handleSocialSignUp("google")} css={socialButtonStyle}>
                Google로 회원가입
              </button>
              <button onClick={() => handleSocialSignUp("github")} css={socialButtonStyle}>
                GitHub로 회원가입
              </button>
            </div>
          )}
          <button type="submit" css={buttonStyle}>
            {isLogin ? "로그인" : "회원가입"}
          </button>
        </form>
        <div css={toggleStyle}>
          <p>{isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}</p>
          <button onClick={() => setIsLogin(!isLogin)} css={toggleButtonStyle}>
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS styles
const WrappedContainer = css`
  width: 100%;
  height: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  background-color: #fea100;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #855c17;
  }
`;

const socialLoginContainerStyle = css`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
`;

const socialButtonStyle = css`
  padding: 10px;
  background-color: #eee;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;

  &:hover {
    background-color: #ddd;
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

const errorMessageStyle = css`
  color: red;
  text-align: center;
`;

const successMessageStyle = css`
  color: green;
  text-align: center;
`;

export default SignUpForm;