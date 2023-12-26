import asyncHandler from "express-async-handler";
import CategoryModel from "../models/categoryModel.js";

import {
  FAIL_HTTP_STATUS,
  SUCCESS_HTTP_STATUS,
} from "../constanst/ResultResponse.js";

// Controller function to retrieve all categories
export const getAllCategory = asyncHandler(async (req, res) => {
  // Fetch all categories from the CategoryModel
  const categoryList = await CategoryModel.find();

  // Set HTTP status and respond with a JSON containing the fetched categories
  res.status(SUCCESS_HTTP_STATUS);
  return res.json({ categoryList });
});

// Controller function to add a new category
export const addCategory = asyncHandler(async (req, res) => {
  // Destructure categoryName and categoryIcon from the request body
  const { categoryName, categoryIcon } = req.body;

  // Check if categoryName or categoryIcon is missing, if so, throw an error
  if (!categoryName) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("categoryName is required");
  }
  if (!categoryIcon) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("categoryIcon is required");
  }

  // Create a new CategoryModel instance with provided categoryName and categoryIcon
  const category = new CategoryModel({
    categoryName,
    categoryIcon,
  });

  // Save the newly created category to the database
  const insertCategory = await category.save();

  // Set HTTP status and respond with a success message and the inserted category details
  res.status(SUCCESS_HTTP_STATUS);
  return res.json({ success: true, insertCategory });
});