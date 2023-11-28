import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  FlexBetween,
  PriceTag,
  ProductTitle,
  Wrapper,
  FlexRow,
  ProductDesc,
  CartButton,
  CategoriesList,
  DataWrapper,
  CartButtonDisabled,
  FlexColumn,
} from "./ProductData.style";
import Quantity from "../../atoms/Quantity";
import Rating from "../../atoms/Rating";
import { InputText, InputArea } from "../../atoms/FormInput/FormInput.style";

export default function ProductData({
  showLinks = false,
  updateProductHandler,
  showDesc = true,
  name,
  unitPrice,
  ratingAverage,
  numReviews,
  description,
  countInStock,
  category,
  _id,
}) {
  const [qty, setQty] = useState(0);

  const [formData, setFormData] = useState({
    name,
    unitPrice,
    description,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Wrapper>
      <InputText
        value={formData.name}
        name="name"
        onChange={handleInputChange}
      />
      <br />
      <FlexBetween>
        <PriceTag style={{ marginTop: "1.5rem" }}>$ </PriceTag>
        <InputText
          value={formData.unitPrice}
          name="unitPrice"
          onChange={handleInputChange}
        />
        <Rating rating={ratingAverage} count={numReviews} />
      </FlexBetween>
      {showDesc && (
        <InputArea
          value={formData.description}
          name="description"
          onChange={handleInputChange}
        />
      )}
      <FlexColumn>
        <Quantity qty={qty} setQty={setQty} numInStock={countInStock} />
        <div>Current product in stocks: {countInStock}</div>
        <CartButton
          onClick={() => {
            formData.countInStock = qty;
            updateProductHandler(_id, formData);
          }}
        >
          Update Product
        </CartButton>
      </FlexColumn>
      <DataWrapper>
        <CategoriesList>
          <span>SKU:</span>
          <p>{_id}</p>
        </CategoriesList>
        {category &&
          category.map((item) => {
            return (
              <CategoriesList>
                <span>Category:</span>
                <Link to={"/category/" + item}>{item}</Link>
              </CategoriesList>
            );
          })}
      </DataWrapper>
    </Wrapper>
  );
}
