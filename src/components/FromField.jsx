import React from "react";
import styled from "@emotion/styled";

const FormField = ({ label, type, value, onChange, required = false }) => {
  return (
    <InputContainerStyle>
      {/* <label>{label}:</label> */}
      <SignUpInput
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={label}
      />
    </InputContainerStyle>
  );
};

//CSS styles

const InputContainerStyle = styled.div`
  min-width: 500px;
  display: flex;
  margin: 1px;
  gap: 10px;
`;

const SignUpInput = styled.input`
  min-width: 37vh;
  padding: 7px;
`;

export default FormField;
