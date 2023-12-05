import React from "react";
import { connect } from "react-redux";
import { InputField, InputGroup, InputLabel } from "./CreateFormInput.style";

export const CreateFormInput = ({
  name,
  value,
  onChange,
  type,
  pattern,
  isHolder = false,
}) => {
  const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <InputGroup>
      <InputLabel for={name}>{capitalizeName}:</InputLabel>
      <InputField
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={isHolder ? `Enter ${capitalizeName}` : ""}
        type={type}
        pattern={pattern}
      />
    </InputGroup>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(CreateFormInput);
