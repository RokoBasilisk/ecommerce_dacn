import React, { useState } from "react";

import {
  ImgDisplay,
  ImgThumb,
  PageWrapper,
  ThumbWrapper,
} from "./pictureDisplay.style";

export default function PictureDisplay({ image }) {
  const [state, setState] = useState(0);
  const [mouseX, setMouseX] = useState(null);

  const changeImage = (param) => {
    if (param === "prev") {
      if (state - 1 >= 0) {
        setState(state - 1);
      } else {
        setState(2);
      }
    } else {
      if (state + 1 < 3) {
        setState(state + 1);
      } else {
        setState(0);
      }
    }
  };

  const mouseDown = (e) => {
    if (mouseX && e.clientX !== mouseX) {
      if (e.clientX > mouseX) {
        changeImage("prev");
      } else {
        changeImage("next");
      }
    }
  };

  const renderImage = (e) => {
    const results = [];
    for (let i = 0; i < 3; i++) {
      results.push(
        <ImgThumb active={state === i} key={i} onMouseEnter={() => setState(i)}>
          <img src={image} alt="" draggable="false" />
        </ImgThumb>
      );
    }
    return results;
  };
  return (
    <PageWrapper>
      <ThumbWrapper>{renderImage()}</ThumbWrapper>
      <ImgDisplay
        onMouseDown={(e) => setMouseX(e.clientX)}
        onMouseUp={(e) => mouseDown(e)}
      >
        <img src={image} alt="" draggable="false" />
      </ImgDisplay>
    </PageWrapper>
  );
}
