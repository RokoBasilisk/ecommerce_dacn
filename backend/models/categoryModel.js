import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    categoryIcon: { type: String, required: true },
  },
  {
    timestamps: false,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
