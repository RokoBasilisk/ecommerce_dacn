import asyncHandler from "express-async-handler";
import CategoryModel from "../models/categoryModel.js";

import { FAIL_HTTP_STATUS, SUCCESS_HTTP_STATUS } from "../constanst/ResultResponse.js";

export const getAllCategory = asyncHandler(async (req, res) => {
    const data = await CategoryModel.find({}).select("categoryName");
    
    res.status(SUCCESS_HTTP_STATUS);
    return res.json({data})
})

export const addCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        res.status(FAIL_HTTP_STATUS);
        return res.json({ success: false, message: "categoryName is required" })
    }

    const category = new CategoryModel({
        categoryName
    });

    const insertCategory = await category.save();

    res.status(SUCCESS_HTTP_STATUS)
    return res.json({sucess: true, insertCategory})
})