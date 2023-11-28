import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";

import AsideBar from "../components/organisms/Sidebar";

export const HomeV2 = ({ children }) => {
  let history = useHistory();
  return (
    <>
      <div className="wrapper">
        {/* Main Sidebar Container */}
        <AsideBar history={history} />
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <h1 className="m-0">Home Page</h1> */}
                </div>
              </div>
            </div>
          </div>
          {/* /.content-header */}

          {/* Main content */}
          <section className="content">
            <div className="container-fluid">{children}</div>
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}

        {/* Main Footer */}
        <footer className="main-footer">
          <strong>Footer Content</strong>
        </footer>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
});

export default connect(mapStateToProps)(HomeV2);
