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

import Protect from "./security/ProtectedRoute";
import HomeV2 from "./pages/HomeV2";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products";
import QuantityModal from "./components/atoms/Modal";
import { exchangeNameEnum, prefixAPI, routingKeyEnum } from "./types";
import { socket } from "./socket";

import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/dist/js/adminlte.min.js";

import "react-toastify/dist/ReactToastify.css";
function App({ userInfo, webSocket }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
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
    if (userInfo) {
      socket.connect();
    }
    return () => {
      if (userInfo) {
        socket.disconnect();
        console.log("disconnect because re-render");
      }
    };
  }, [userInfo]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      socket.emit("join", userInfo._id);
      socket.on(userInfo._id, onJoin);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnect");
    }

    function onAddOrder(notification) {
      toast.info(notification.message, {
        className: "text-info",
      });
    }

    function onPayOrder(notification) {
      toast(notification.message, {
        className: "text-info",
      });
    }

    function onJoin() {
      console.log("join room");
      socket.emit(
        exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.ADD_ORDER,
        userInfo._id
      );
      socket.emit(
        exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.PAY_ORDER,
        userInfo._id
      );
      console.log("Notification listen...", userInfo._id);
      socket.on(
        exchangeNameEnum.NOTIFICATION +
          "_" +
          routingKeyEnum.ADD_ORDER +
          "_" +
          userInfo._id,
        onAddOrder
      );
      socket.on(
        exchangeNameEnum.NOTIFICATION +
          "_" +
          routingKeyEnum.PAY_ORDER +
          "_" +
          userInfo._id,
        onPayOrder
      );
    }
    if (userInfo) {
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      if (userInfo) {
        socket.off(userInfo._id);
        socket.off(
          exchangeNameEnum.NOTIFICATION +
            "_" +
            routingKeyEnum.ADD_ORDER +
            "_" +
            userInfo._id
        );
        socket.off(
          exchangeNameEnum.NOTIFICATION +
            "_" +
            routingKeyEnum.PAY_ORDER +
            "_" +
            userInfo._id
        );
      }
    };
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
  webSocket: state.userLogin.webSocket,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
