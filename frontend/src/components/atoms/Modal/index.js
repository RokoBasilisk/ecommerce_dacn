import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import { connect } from "react-redux";
import { useHistory } from "react-router";

import {
  clearProductDetails,
  updateProduct,
} from "../../../actions/productActions";

import {
  ModalContainer,
  Wrapper,
  ModalStyle,
  ModalContent,
  ModalBody,
} from "./Modal.style";

import PictureDisplay from "../PictureDisplay";
import ProductData from "../../molecules/ProductData";
import Prefetch from "../../molecules/Prefetch";
import ProductContent from "../../molecules/ProductContent";
import axios from "axios";
import { prefixAPI } from "../../../types";

export function QuantityModal({
  productDetails,
  clearProductDetails,
  updateProduct,
}) {
  const { error, loading, product, isModalOn } = productDetails || {
    error: false,
    loading: true,
    product: {},
    isModalOn: false,
  };

  function updateProductHandler(pId, formData) {
    updateProduct(pId, formData);
  }

  if (!isModalOn) return null;
  if (error || loading) return <Prefetch loading={loading} error={error} />;
  return ReactDom.createPortal(
    <>
      <ModalStyle>
        <ModalBody onClick={clearProductDetails}>
          <ModalContainer>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <Wrapper>
                {/* <PictureDisplay images={Array(3).fill(product.image)} /> */}
                <ProductContent product={product} />
                <ProductData
                  showLinks
                  {...product}
                  updateProductHandler={updateProductHandler}
                />
              </Wrapper>
            </ModalContent>
          </ModalContainer>
        </ModalBody>
      </ModalStyle>
    </>,
    document.getElementById("modal-root")
  );
}

const mapStateToProps = (state) => ({
  productDetails: state.productDetails,
});

const mapDispatchToProps = {
  clearProductDetails,
  updateProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuantityModal);
