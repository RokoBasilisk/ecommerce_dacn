import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";

import AsideBar from "../components/organisms/Sidebar";
import { Container, Row } from "react-bootstrap";

const sideItemList = [
  {
    path: "/",
    content: "DashBoard",
    icon: <i className="nav-icon fas fa-home"></i>,
  },
  {
    path: "/products",
    content: "Product List",
    icon: <i className="nav-icon fas fa-store"></i>,
  },
  {
    path: "/orders",
    content: "Order List",
    icon: <i className="nav-icon fas fa-shopping-cart"></i>,
  },
  {
    path: "/profile",
    content: "Profile",
    icon: <i className="nav-icon fas fa-id-card"></i>,
  },
];

export const HomeV2 = ({ children }) => {
  let { pathname } = useLocation();
  let routeNameMapping;
  return (
    <>
      <div className="wrapper d-flex">
        {/* Main Sidebar Container */}
        {/* <AsideBar history={history} /> */}
        <Sidebar>
          <Menu
            menuItemStyles={{
              button: {
                // the active class will be added automatically by react router
                // so we can use it to style the active menu item
                [`&.ps-active`]: {
                  backgroundColor: "#13395e",
                  color: "#b6c8d9",
                },
              },
            }}
          >
            {/* <SubMenu
              icon={<i className="nav-icon fas fa-home" />}
              label="Charts"
            >
              <MenuItem>Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>
            <MenuItem> Documentation </MenuItem>
            <MenuItem> Calendar </MenuItem> */}
            {sideItemList.map(({ path, content, icon }) => (
              <MenuItem
                active={pathname === path}
                component={<Link to={path} />}
                icon={icon}
                key={path}
              >
                {content}
              </MenuItem>
            ))}
          </Menu>
        </Sidebar>
        {/* Content Wrapper. Contains page content */}
        {/* /.content-header */}

        {/* Main content */}
        <Container fluid className="mt-2">
          {children}
        </Container>
        {/* /.content */}
      </div>
      {/* /.content-wrapper */}
    </>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
});

export default connect(mapStateToProps)(HomeV2);
