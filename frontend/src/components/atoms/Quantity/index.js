import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

import {
  BtnWrapper,
  MinusButton,
  PlusButton,
  QtyInput,
  Wrapper,
} from "./quantity.style";

export default function Quantity({ qty, setQty, numInStock }) {
  const changeQty = (action) => {
    if (action === "add") {
      setQty((prevVal) => prevVal + 1);
    } else {
      setQty((prevVal) => prevVal - 1);
    }
  };

  return (
    <Wrapper>
      <QtyInput
        max={numInStock}
        value={qty}
        onChange={() => setQty(qty)}
      ></QtyInput>
      <BtnWrapper>
        <MinusButton onClick={() => changeQty("rem")}>
          <FaMinus />
        </MinusButton>
        <PlusButton onClick={() => changeQty("add")}>
          <FaPlus />
        </PlusButton>
      </BtnWrapper>
    </Wrapper>
  );
}
