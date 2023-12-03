import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import MissingPage from "./pages/MissingPage";
import Search from "./pages/Search";
import Layout from "./components/Layout";

import Modal from "./components/organisms/Modal";
import Protect from "./security/ProtectedRoute";
import HomeV2 from "./pages/HomeV2";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products";
import QuantityModal from "./components/atoms/Modal";

import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/dist/js/adminlte.min.js";

function App() {
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
  return (
    <BrowserRouter>
      <Layout>
        {/* <Modal /> */}
        <QuantityModal />
        <Switch>
          {/* <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route
            path="/products"
            exact
            component={() => (
              <Protect>
                <HomeV2>
                  <Products />
                </HomeV2>
              </Protect>
            )}
          />
          <Route
            path="/products/new"
            exact
            component={() => (
              <Protect>
                <HomeV2>
                  <Product />
                </HomeV2>
              </Protect>
            )}
          />
          <Route
            path="/"
            exact
            component={() => (
              <Protect>
                <HomeV2>
                  <DashBoard />
                </HomeV2>
              </Protect>
            )}
          /> */}
          {/* </HomeV2> */}
          {/* </Protect> */}
          {/* <Route component={MissingPage} /> */}
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

export default App;
