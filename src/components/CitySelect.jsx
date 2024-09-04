import React from 'react';

const CitySelect = ({ value, onChange, required = false }) => {
  const cities = [
    '서울',
    '부산',
    '강원도',
    '경기도',
    '경상도',
    '전라도',
    '제주도',
    '충청도',
  ];

  return (
    <div>
      <label>도시:</label>
      <select value={value} onChange={onChange} required={required}>
        <option value="">도시를 선택하세요</option>
        {cities.map(city => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelect;

