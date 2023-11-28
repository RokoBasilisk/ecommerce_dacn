import express from "express";

import {
    getAllCategory,
    addCategory
  } from "../controllers/categoryController.js";

const router = express.Router();

router.route("/")
    .get(getAllCategory)
    .post(addCategory)

export default router;
