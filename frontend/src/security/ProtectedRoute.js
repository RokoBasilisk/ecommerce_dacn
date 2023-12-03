import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";

export const Protect = ({ children, userInfo }) => {
  let history = useHistory();
  //   const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {
    if (!userInfo) history.push("/login");
  }, [history, userInfo]);
  return <>{userInfo ? children : null}</>;
};

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Protect);
