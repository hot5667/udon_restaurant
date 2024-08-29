import React, { useState } from 'react';
import supabase from '../supaBasecClient';
import { generateUserKey } from '../util/utils';  // UUID 생성 함수 import

const SignUp = () => {
  const [userKey, setUserKey] = useState(generateUserKey());  // UUID 생성하여 초기값으로 설정
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const cities = ['Seoul', 'Busan', 'Incheon', 'Daegu'];

  // ID 중복 확인
  const checkUserId = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('UserID', userId);
    
    if (error) {
      setError('Error checking ID');
      return false;
    }
    
    if (data.length > 0) {
      setError('UserID already exists');
      return false;
    }

    return true;
  };

  // 특수문자 체크 함수
  const hasSpecialChar = (str) => /[!@#$%^&*(),.?":{}|<>]/g.test(str);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (hasSpecialChar(userId)) {
      setError('UserID cannot contain special characters');
      return;
    }

    if (!hasSpecialChar(userPw)) {
      setError('Password must contain at least one special character');
      return;
    }

    if (hasSpecialChar(userName)) {
      setError('UserName cannot contain special characters');
      return;
    }

    const isIdUnique = await checkUserId();
    if (!isIdUnique) return;

    const { error } = await supabase.from('users').insert([
      { UserKEY: userKey, UserID: userId, UserPW: userPw, UserName: userName, UserCity: userCity }
    ]);

    if (error) {
      setError('Failed to sign up');
    } else {
      setSuccess('Sign up successful!');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSignUp}>
        <div>
          <label>UserKey:</label>
          <input type="text" value={userKey} readOnly /> {/* UserKey는 읽기 전용으로 설정 */}
        </div>
        <div>
          <label>UserID:</label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={userPw} onChange={(e) => setUserPw(e.target.value)} required />
        </div>
        <div>
          <label>UserName:</label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>
        <div>
          <label>City:</label>
          <select value={userCity} onChange={(e) => setUserCity(e.target.value)} required>
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;