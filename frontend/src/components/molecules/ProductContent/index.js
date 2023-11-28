import React from "react";

import {
  CardTitle,
  RatingTitle,
  RatingWrapper,
  ReviewCard,
  ReviewContent,
  ReviewTime,
  ReviewTitle,
  ReviewWrapper,
  Text,
  Title,
  Wrapper,
} from "./ProductContent.style";
import { Container } from "../../../styles/main.styles";
import Rating from "../../atoms/Rating";
import OverallRating from "../OverallRating";

export default function ProductContent({ isUserLogged, product }) {
  return (
    <Container>
      <Wrapper>
        <Title>
          <span>User reviews</span>
        </Title>
        <OverallRating product={product} />
        <ReviewWrapper>
          {product.reviews.map((review) => {
            console.log(review);
            var d = new Date(review.createdAt);
            return (
              <ReviewCard key={review.user.email}>
                <CardTitle>
                  <span>{review.user.email}</span>
                  <ReviewTime>
                    {d.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </ReviewTime>
                </CardTitle>
                <RatingTitle>
                  <RatingWrapper>
                    <Rating rating={review.rating} align="flex-start" />
                  </RatingWrapper>
                  <ReviewTitle>{review.user.name}</ReviewTitle>
                </RatingTitle>
                <ReviewContent>{review.comment}</ReviewContent>
              </ReviewCard>
            );
          })}
        </ReviewWrapper>
      </Wrapper>
    </Container>
  );
}
