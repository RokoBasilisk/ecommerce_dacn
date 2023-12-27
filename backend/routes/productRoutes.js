import express from "express";
import {
  addReview,
  createProductAdmin,
  deleteProductAdmin,
  getCategoryNames,
  getProductByCategory,
  getProductById,
  getProducts,
  getProductsByShop,
  updateProductAdmin,
  getReviewValid,
  recommendProduct
} from "../controllers/productController.js";
import { isShop, protect, isCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts);

router.route("/").post(protect, isShop, createProductAdmin);

router.route("/shop").get(protect, isShop, getProductsByShop);

router.route("/recommend/:q").get(protect, isCustomer, recommendProduct);

router.route("/category/name").get(getCategoryNames);

router.route("/category/").post(getProductByCategory);

router.route("/:id/review").get(protect, isCustomer, getReviewValid);

router.route("/:id/reviews").post(protect, isCustomer, addReview);

router.route("/:id").get(getProductById);

router.route("/:id").delete(protect, isShop, deleteProductAdmin);

router.route("/:id").patch(protect, isShop, updateProductAdmin);


export default router;
