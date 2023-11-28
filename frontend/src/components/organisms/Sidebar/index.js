import React from "react";
import { Link } from "react-router-dom";

import {
  ButtonPrimary,
  ButtonOutlineSecondary,
  TableSMStripedBordered,
  Row,
  Col,
} from "../../../styles/bootstrap.style";

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
    path: "/profile",
    content: "Profile",
    icon: <i className="nav-icon fas fa-user"></i>,
  },
];

export const AsideBar = ({
  history: {
    location: { pathname },
  },
}) => {
  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add your sidebar items here */}
              {sideItemList.map(({ path, content, icon }) => (
                <Link to={path} key={path}>
                  <ButtonOutlineSecondary>
                    {content}
                    {icon}
                  </ButtonOutlineSecondary>
                </Link>
              ))}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
};

export default AsideBar;
