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
  return (
    <BrowserRouter>
      <Layout>
        {/* <Modal /> */}
        <QuantityModal />
        <Switch>
          {/* <Route path="/order/:id/:pay?" component={Order} />
          <Route path="/placeorder" component={PlaceOrder} />
          <Route path="/payment" component={Payment} />
          <Route path="/shipping" component={Shipping} />
          <Route path="/profile" component={Profile} /> */}
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          {/* <Route path="/cart" component={Cart} />
          <Route path="/category/:cat/:pageNumber?" component={Category} /> */}
          {/* <Route
            path="/search/:keyword/page/:pageNumber"
            exact
            component={Search}
            />
          <Route path="/search/:keyword" exact component={Search} /> */}
          <Protect>
            <HomeV2>
              <Route path="/products" exact component={Products} />
              <Route path="/products/new" exact component={Product} />
              <Route path="/" exact component={DashBoard} />
            </HomeV2>
          </Protect>
          <Route path="/404" exact component={MissingPage} />
          <Route component={MissingPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
