import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supaBasecClient';

const SocialSignUp = () => {
  const [userCity, setUserCity] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userProfile, setUserProfil] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cities = ['서울', '부산', '인천', '대구'];

  useEffect(() => {
    // 컴포넌트가 마운트되면 현재 사용자 정보를 가져옵니다.
    const fetchUserData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error('세션 정보를 가져오는 중 오류가 발생했습니다.');

        const user = sessionData.session.user;

        // 사용자 정보를 조회하여 기존 데이터를 미리 채웁니다.
        const { data: existingUser, error: fetchError } = await supabase
          .from('User')
          .select('*')
          .eq('UserID', user.id)
          .single();

        if (fetchError) throw new Error('사용자 정보를 가져오는 중 오류가 발생했습니다.');

        if (existingUser) {
          setUserCity(existingUser.UserCity || '');
          setUserNickName(existingUser.UserNickName || '');
          setUserProfil(existingUser.UserProfil || '');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw new Error('세션 정보를 가져오는 중 오류가 발생했습니다.');

      const user = sessionData.session.user;

      // 사용자의 정보를 업데이트합니다. (닉네임이 변경된 경우에도 업데이트)
      const { error: updateError } = await supabase
        .from('User')
        .update({
          UserCity: userCity,
          UserNickName: userNickName,
          UserProfile: userProfile,
        })
        .eq('UserID', user.id);

      if (updateError) throw new Error('사용자 정보를 업데이트하는 중 오류가 발생했습니다.');

      // 업데이트 완료 후 프로필 페이지로 리디렉션
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>추가 정보 입력</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>도시:</label>
          <select value={userCity} onChange={e => setUserCity(e.target.value)} required>
            <option value="">도시를 선택하세요</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>닉네임:</label>
          <input type="text" value={userNickName} onChange={e => setUserNickName(e.target.value)} required />
        </div>
        <div>
          <label>프로필 이미지 URL:</label>
          <input type="text" value={userProfile} onChange={e => setUserProfil(e.target.value)} required />
        </div>
        <button type="submit">정보 제출</button>
      </form>
    </div>
  );
};

export default SocialSignUp;
