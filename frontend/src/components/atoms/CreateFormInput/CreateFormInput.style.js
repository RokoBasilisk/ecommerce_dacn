import styled from "styled-components";

export const InputLabel = styled.label`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

export const InputField = styled.input`
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #55595c;
  background-clip: padding-box;
  border: 0 solid #ced4da;
  border-radius: 0;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  ${({ isInvalid }) =>
    isInvalid
      ? `border-color: #d9534f; box-shadow: 0 0 0 0.2rem rgb(217 83 79 / 25%);`
      : ""};
  :focus {
    color: #55595c;
    background-color: #f7f7f9;
    border-color: #5a5a5a;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgb(26 26 26 / 25%);
  }
`;

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 200px 700px;
  margin-bottom: 5px;
`;
