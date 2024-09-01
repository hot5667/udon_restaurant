import React, { useState, useEffect} from 'react';
import supabase from '../supaBasecClient';

const UpdateProfile = () => {
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

          setUsername(profileData.username || '');
          setCity(profileData.city || '');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) throw new Error(authError.message);

      const userId = authData.user?.id;

      if (userId) {
        const { error: updateError } = await supabase
          .from('Membership')
          .update({ username, city })
          .eq('id', userId);

        if (updateError) throw new Error(updateError.message);

        setSuccess('프로필이 성공적으로 업데이트되었습니다!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>프로필 업데이트</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>사용자 이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>도시:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <button type="submit">업데이트</button>
      </form>
    </div>
  );
};

export default UpdateProfile;