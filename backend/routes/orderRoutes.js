import express from "express";
import {
  addOrderItems,
  getAllOrders,
  getOrderById,
  getOrderUserOrders,
  putUpdateOrderToDelivered,
  payoutForShop,
} from "../controllers/orderController.js";
import { isCustomer, isShop, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, isCustomer, addOrderItems)
  .get(protect, isShop, getAllOrders);

router.route("/myorders").get(protect, isCustomer, getOrderUserOrders);

router.route("/:orderId/payout").post(protect, isCustomer, payoutForShop);

router.route("/:id/deliver").put(protect, isShop, putUpdateOrderToDelivered);

router.route("/:id").get(protect, getOrderById);

export default router;
