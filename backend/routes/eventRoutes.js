import express from "express";

import { getShopEvent } from "../controllers/eventController.js";

import { isShop, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getShopEvent);

export default router;
