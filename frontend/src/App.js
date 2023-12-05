import { BrowserRouter, Route, Switch } from "react-router-dom";

import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Order from "./pages/Order";
import MissingPage from "./pages/MissingPage";
import Layout from "./components/Layout";

import Protect from "./security/ProtectedRoute";
import HomeV2 from "./pages/HomeV2";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products";
import QuantityModal from "./components/atoms/Modal";

import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import { exchangeNameEnum, prefixAPI, routingKeyEnum } from "./types";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { connect } from "react-redux";

function App({ userInfo, webSocket }) {
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
      path: "/",
      component: <DashBoard />,
      isPrivate: true,
    },
    {
      path: "*",
      component: <MissingPage />,
    },
  ];
  useEffect(() => {
    if (webSocket) {
      webSocket.on("connect", () => {
        webSocket.emit("join", userInfo._id);

        webSocket.on(userInfo._id, () => {
          console.log("Notification listen success");
          webSocket.emit(
            exchangeNameEnum.NOTIFICATION + routingKeyEnum.ADD_ORDER
          );
        });

        webSocket.on(
          exchangeNameEnum.NOTIFICATION + routingKeyEnum.ADD_ORDER,
          (notification) => {
            console.log("Notification received:", notification);
          }
        );
      });
      return () => {
        webSocket.disconnect();
      };
    }
  }, [userInfo]);
  return (
    <BrowserRouter>
      <Layout>
        <QuantityModal />
        <Switch>
          {routeRender.map((route) => {
            if (route.isPrivate) {
              return (
                <Route
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
                <Route path={route.path} component={() => route.component} />
              );
            }
          })}
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.userLogin.userInfo,
  webSocket: state.userLogin.webSocket,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
