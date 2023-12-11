import express from "express";

import { getShopEvent } from "../controllers/eventController.js";

const router = express.Router();

router.route("/").get(protect, isShop, getShopEvent);

export default router;
