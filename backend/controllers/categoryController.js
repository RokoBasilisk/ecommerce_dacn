import asyncHandler from "express-async-handler";
import CategoryModel from "../models/categoryModel.js";

import {
  FAIL_HTTP_STATUS,
  SUCCESS_HTTP_STATUS,
} from "../constanst/ResultResponse.js";

export const getAllCategory = asyncHandler(async (req, res) => {
  const categoryList = await CategoryModel.find();

  res.status(SUCCESS_HTTP_STATUS);
  return res.json({ categoryList });
});

export const addCategory = asyncHandler(async (req, res) => {
  const { categoryName, categoryIcon } = req.body;

  if (!categoryName) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("categoryName is required");
  }
  if (!categoryIcon) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("categoryIcon is required");
  }

  const category = new CategoryModel({
    categoryName,
    categoryIcon,
  });

  const insertCategory = await category.save();

  res.status(SUCCESS_HTTP_STATUS);
  return res.json({ sucess: true, insertCategory });
});
