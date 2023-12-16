import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Order from "./pages/Order";
import MissingPage from "./pages/MissingPage";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";

import Protect from "./security/ProtectedRoute";
import HomeV2 from "./pages/HomeV2";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products";
import QuantityModal from "./components/atoms/Modal";

import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/dist/js/adminlte.min.js";

import "react-toastify/dist/ReactToastify.css";
function App({ userInfo }) {
  const routeRender = [
    {
      path: "/register",
      component: <Register />,
    },
    {
      path: "/login",
      component: <Login />,
    },
    {
      path: "/products",
      component: <Products />,
      isPrivate: true,
    },
    {
      path: "/orders",
      component: <Order />,
      isPrivate: true,
    },
    {
      path: "/products/new",
      component: <Product />,
      isPrivate: true,
    },
    {
      path: "/profile",
      component: <Profile />,
      isPrivate: true,
    },
    {
      path: "/",
      component: <DashBoard />,
      isPrivate: true,
    },
    {
      path: "*",
      component: <MissingPage />,
    },
  ];

  return (
    <BrowserRouter>
      <Layout>
        <QuantityModal />
        <Switch>
          {routeRender.map((route) => {
            if (route.isPrivate) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  exact
                  component={() => (
                    <Protect>
                      <HomeV2>{route.component}</HomeV2>
                    </Protect>
                  )}
                />
              );
            } else {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  component={() => route.component}
                />
              );
            }
          })}
        </Switch>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick
        theme="light"
        limit={3}
      />
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
