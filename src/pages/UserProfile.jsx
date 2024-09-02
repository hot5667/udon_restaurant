import React, { useState, useEffect } from 'react';
import supabase from '../supaBasecClient';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw new Error(authError.message);

        const userId = authData.user?.id;

        if (userId) {
          const { data: profileData, error: profileError } = await supabase
            .from('Membership')
            .select('*')
            .eq('id', userId)
            .single();

          if (profileError) throw new Error(profileError.message);

          setProfile(profileData);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>사용자 프로필</h1>
      {profile ? (
        <div>
          <p>이메일: {profile.email}</p>
          <p>사용자 이름: {profile.username}</p>
          <p>도시: {profile.city}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default UserProfile;