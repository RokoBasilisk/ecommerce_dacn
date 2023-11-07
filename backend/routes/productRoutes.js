import express from "express";
import {
  addReview,
  createProductAdmin,
  deleteProductAdmin,
  getCategoryNames,
  getFeaturedProducts,
  getProductByCategory,
  getProductById,
  getProducts,
  getTopProducts,
  updateProductAdmin,
} from "../controllers/productController.js";
import { isShop, protect, isCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts);

router.route("/").post(protect, isShop, createProductAdmin);

router.route("/featured/:category?").get(getFeaturedProducts);

router.route("/top/:category?").get(getTopProducts);

router.route("/:id").get(getProductById);

router.route("/:id").delete(protect, isShop, deleteProductAdmin);

router.route("/:id").patch(protect, isShop, updateProductAdmin);

router.route("/category/name").get(getCategoryNames);

router.route("/category/:category").get(getProductByCategory);

router.route("/:id/reviews").post(protect, isCustomer, addReview);

export default router;
