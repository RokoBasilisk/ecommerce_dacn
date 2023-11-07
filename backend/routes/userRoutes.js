import express from "express";
import {
  authUser,
  getUsersAdmin,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { isCustomer, isShop, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);

router.route("/:id?").post(registerUser).get(protect, isShop, getUsersAdmin);

router.route("/profile").patch(protect, updateUserProfile);

export default router;
