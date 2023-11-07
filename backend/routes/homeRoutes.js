import express from "express";
import {
  getFeaturedCategoryData,
  getMessageData,
} from "../controllers/homeController.js";

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: API endpoints for the home router
 * /message:
 *   get:
 *     summary: Get message data
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Success
 * /featCategory:
 *   get:
 *     summary: Get featured category data
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Success
 */
const router = express.Router();

router.route("/message").get(getMessageData);

router.route("/featCategory").get(getFeaturedCategoryData);

export default router;
