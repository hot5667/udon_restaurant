import React from 'react';

const FormField = ({ label, type, value, onChange, required = false }) => {
  return (
    <div>
      <label>{label}:</label>
      <input type={type} value={value} onChange={onChange} required={required} />
    </div>
  );
};

export default FormField;