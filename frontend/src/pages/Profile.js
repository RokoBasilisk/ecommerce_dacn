import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import { updateUserProfile } from "../actions/userAction";

import Meta from "../components/atoms/Meta";

export function Profile({}) {
  return <></>;
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
