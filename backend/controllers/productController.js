import asyncHandler from "express-async-handler";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

import ProductModel from "../models/productModel.js";
import sanitize from "../utils/sanitize.js";
import Mongoose from "mongoose";
import {
  FAIL_HTTP_STATUS,
  SUCCESS_HTTP_STATUS,
} from "../constanst/ResultResponse.js";
import eventRepository from "../repository/eventRepository.js";
import Category from "../models/categoryModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          // $regex is there so the user doesn't have to search exact product name
          $regex: req.query.keyword,
          $options: "i",
        },
        isDeleted: false,
      }
    : { isDeleted: false };

  const count = await ProductModel.countDocuments({ ...keyword });
  const products = await ProductModel.find({ ...keyword })
    .populate({
      path: "user",
      select: "-password",
    })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.status(SUCCESS_HTTP_STATUS);
  return res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

export const getProductsByShop = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber);

  const keyword = req.query.keyword
    ? {
        name: {
          // $regex is there so the user doesn't have to search exact product name
          $regex: req.query.keyword,
          $options: "i",
        },
        user: req.user._id,
        isDeleted: false,
      }
    : { user: req.user._id, isDeleted: false };
  const count = await ProductModel.countDocuments({ ...keyword });
  const products = await ProductModel.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single product
// @route GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
  if (!Mongoose.Types.ObjectId.isValid(sanitize(req.params.id))) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Bad ObjectId");
  }
  const product = await ProductModel.find({
    _id: sanitize(req.params.id),
    isDeleted: false,
  })
    .populate("reviews.user")
    .select("-password");

  if (product) {
    res.status(SUCCESS_HTTP_STATUS);
    res.json(product[0]);
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Product not found");
  }
});

// @desc Check user valid to review
// @route GET /api/products/:id/review
// @access private
export const getReviewValid = asyncHandler(async (req, res) => {
  if (!Mongoose.Types.ObjectId.isValid(sanitize(req.params.id))) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Bad ObjectId");
  }

  const orderedProduct = await ProductModel.find({
    user: req.user._id,
    orderItems: {
      $elemMatch: { productId: req.params.id }
    }
  });

  if (orderedProduct.length == 0) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Haven't order item yet");
  }

  const product = await ProductModel.find({
    _id: sanitize(req.params.id),
    reviews: { $elemMatch: { user: req.user._id } },
    isDeleted: false,
  });
  if (product.length != 0) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Product already rating");
  }
  res.status(SUCCESS_HTTP_STATUS);
  res.json({success: true});
})

// @desc Fetch all categories names
// @route GET /api/products/category/name
// @access Public
export const getCategoryNames = asyncHandler(async (req, res) => {
  const categoryNames = await Category.find({});
  const categoryNameList = [];
  for (let {categoryName} of categoryNames) {
    categoryNameList.push(categoryName);
  }

  if (categoryNameList.length > 0) {
    res.status(SUCCESS_HTTP_STATUS);
    res.json(categoryNameList);
  } else {
    res.json([]);
  }
});

// @desc Fetch all product of a given category
// @route Post /api/products/category/
// @access Public
export const getProductByCategory = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.body.pageNumber);

  const condition =
    req.body.categories && req.body.categories.length > 0
      ? {
          category: { $in: sanitize(req.body.categories) },
          isDeleted: false,
        }
      : { isDeleted: false, };

  const count = await ProductModel.countDocuments(condition);

  const category = await ProductModel.find(condition)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (category.length > 0) {
    res.status(SUCCESS_HTTP_STATUS);
    res.json({ page, pages: Math.ceil(count / pageSize), products: category });
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Category is empty");
  }
});

// @desc Delete a product
// @route GET /api/products/:id
// @access Private
export const deleteProductAdmin = asyncHandler(async (req, res) => {
  const object = await ProductModel.findById(sanitize(req.params.id));

  if (object) {
    if (object.user.toString() !== req.user._id.toString()) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Not Authorized");
    }

    if (object.isDeleted) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Product not found");
    }
    object.isDeleted = true;
    await object.save();
    await eventRepository.add({
      eventTargetId: req.user._id,
      eventName: "deleteProductAdmin",
      eventContext: `Delete Product ${object.name} by ${req.user.name}`,
      aggregateData: JSON.stringify(object),
    });
    res.status(SUCCESS_HTTP_STATUS);
    res.json({ message: "Product removed" });
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Object not found");
  }
});

// @desc Recommend products
// @route GET /api/products/recommend/:q
// @access Private
export const recommendProduct = asyncHandler(async (req, res) => {
  const productId = req.params.q;

  try {
    const productRating = await ProductModel.find({
      reviews: {
        $elemMatch: { user: req.user._id }
      }
    })
    if (
      productRating == null ||
      productRating == undefined ||
      productRating.length == 0
    ) {
      const recommend = await axios.get(
        `http://localhost:5500/nonrating?q=${productId}`
      );

      const response = await ProductModel.find({
        _id: { $in: recommend.data.response },
      });

      if (response.length !== 0) {
        console.log(response);
        res.json({ success: true, products: response });
      } else {
        res.status(500).json({ success: false, Products: [] });
      }
    } else {
      const recommend = await axios.get(`http://localhost:5500/?q=${req.user._id}`);

      const response = await ProductModel.find({
        _id: { $in: recommend.data.response },
      });

      if (response.length !== 0) {
        console.log(response);
        res.json({ success: true, Products: response });
      } else {
        res.status(500).json({ success: false, Products: [] });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
})

// @desc Create a product
// @route POST /api/product/
// @access Private
export const createProductAdmin = asyncHandler(async (req, res) => {
  let image = req.body.image;
  if (!image) {
    image = "/uploads/defaultProduct.png";
  }
  const object = new ProductModel({
    user: req.user._id,
    name: sanitize(req.body.name),
    image: sanitize(image),
    category: req.body.category,
    description: sanitize(req.body.description),
    reviews: [],
    ratingSum: 0,
    numReviews: 0,
    ratingAverage: 0,
    unitPrice: sanitize(req.body.unitPrice),
    countInStock: sanitize(req.body.countInStock),
    isDeleted: false,
  });
  const createdObj = await object.save();
  await eventRepository.add({
    eventTargetId: req.user._id,
    eventName: "createProductAdmin",
    eventContext: `Create Product ${createdObj.name} by ${req.user.name}`,
    aggregateData: JSON.stringify(createdObj),
  });
  res.status(SUCCESS_HTTP_STATUS);
  res.json(createdObj);
});

// @desc Update product data
// @route PATCH /api/product/:id
// @access Private
export const updateProductAdmin = asyncHandler(async (req, res) => {
  const object = await ProductModel.findById(sanitize(req.params.id));
  if (object) {
    object.image = sanitize(req.body.image) || object.image;
    object.name = sanitize(req.body.name) || object.name;
    object.category = sanitize(req.body.category) || object.category;
    object.description = sanitize(req.body.description) || object.description;
    object.unitPrice = sanitize(req.body.unitPrice) || object.unitPrice;
    object.countInStock += sanitize(req.body.countInStock);

    const updatedObj = await object.save();
    await eventRepository.add({
      eventTargetId: req.user._id,
      eventName: "updateProductAdmin",
      eventContext: `Update Product ${object.name} by ${req.user.name}`,
      aggregateData: JSON.stringify(object),
    });
    res.status(SUCCESS_HTTP_STATUS);
    res.json(updatedObj);
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("User not found");
  }
});

// @desc Creates a new reviews
// @route POST /api/product/:id/reviews
// @access Private
export const addReview = asyncHandler(async (req, res) => {
  const object = await ProductModel.findById(sanitize(req.params.id));
  if (object) {
    if (object.isDeleted) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Product not found");
    }
    const alrRev = object.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (alrRev) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Already reviewed");
    }

    const objReview = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    object.reviews.push(objReview);
    object.numReviews = object.reviews.length;
    object.ratingSum += objReview.rating;
    object.ratingAverage = object.ratingSum / object.numReviews;

    const updatedObj = await object.save();
    res.status(SUCCESS_HTTP_STATUS);
    res.json({success: true});
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Product not found");
  }
});
