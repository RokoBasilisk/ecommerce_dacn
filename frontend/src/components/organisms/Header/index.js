import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FaUser, FaShoppingCart, FaSearch, FaBars } from "react-icons/fa";

import { Container } from "../../../styles/main.styles";
import {
  Header,
  LogoImg,
  NavCol,
  NavHeader,
  SubHeader,
  NavMouseOver,
  CatLink,
  ContHead,
  SearchInput,
  SearchButton,
  NavDropDown,
  CatDropDown,
  CatSub,
} from "./Header.style";

import img from "./title.svg";
import Cart from "../../molecules/Cart";
import Categories from "../../atoms/Categories";
import Account from "../../atoms/Account";

export default function StoreHeader({
  userInfo,
  itemsOnCart,
  categoriesList,
  logout,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  let history = useHistory();
  function handleSearch() {
    history.push("/search/" + searchQuery);
  }

  function handleSearchInput(e) {
    if (e.key === "Enter") return handleSearch();
  }

  function handleLogout() {
    logout();
    history.push("/login");
  }
  return (
    <>
      <Header
        style={{ borderBottom: "0.0625rem solid rgba(231, 234, 243, 0.7)" }}
      >
        <Container>
          <NavHeader>
            <NavCol align="flex-start">
              <LogoImg>
                <Link to="/">
                  <img src={img} alt="logo" />
                </Link>
              </LogoImg>
            </NavCol>
            <NavCol align="flex-end">
              {/* <NavMouseOver id="cart" onClick={() => history.push("/cart")}>
                <FaShoppingCart size="32" />
                <NavDropDown cart onClick={(e) => e.stopPropagation()}>
                  <Cart items={itemsOnCart} />
                </NavDropDown>
              </NavMouseOver> */}
              <NavMouseOver id="user" onClick={() => history.push("/profile")}>
                <FaUser size="32" />
                <NavDropDown onClick={(e) => e.stopPropagation()}>
                  <Account auth={userInfo} logout={handleLogout} />
                </NavDropDown>
              </NavMouseOver>
            </NavCol>
          </NavHeader>
        </Container>
      </Header>
    </>
  );
}
