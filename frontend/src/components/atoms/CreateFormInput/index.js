import React from "react";
import { connect } from "react-redux";
// import { InputField, InputGroup, InputLabel } from "./CreateFormInput.style";
import { Form, InputGroup } from "react-bootstrap";

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
    <InputGroup className="mb-3">
      <InputGroup.Text id={name} className="text-info col-sm-3">
        {capitalizeName}
      </InputGroup.Text>
      <Form.Control
        placeholder={isHolder ? `Enter ${capitalizeName}` : ""}
        aria-label={capitalizeName}
        aria-describedby={name}
        type={type}
        pattern={pattern}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    </InputGroup>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(CreateFormInput);
