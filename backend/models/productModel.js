import mongoose from "mongoose";

export const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: { type: Number, required: true, default: 0 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Array, required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    ratingSum: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    ratingAverage: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Product", productModel);

export default User;
