import asyncHandler from "express-async-handler";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

import UserModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import sanitize from "../utils/sanitize.js";
import emailValidate from "../utils/emailValidate.js";
import {
  FAIL_HTTP_STATUS,
  SUCCESS_HTTP_STATUS,
} from "../constanst/ResultResponse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("User not found");
  }

  const dataReturn = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    token: generateToken(user.id),
  };
  if (user.isShop) {
    dataReturn.paypalEmail = user.paypalEmail;
    dataReturn.isShop = user.isShop;
  }

  if (user && (await user.matchPassword(password))) {
    res.status(SUCCESS_HTTP_STATUS);
    res.json(dataReturn);
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Invalid password or email");
  }
});

// @desc Update user profile
// @route PATCH /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(sanitize(req.user._id));
  if (user) {
    user.name = sanitize(req.body.name) || user.name;
    user.email = sanitize(req.body.email) || user.email;
    if (req.body.password) {
      user.password = sanitize(req.body.password);
    }
    user.paypalEmail = sanitize(req.body.paypalEmail) || user.paypalEmail;
    const updatedUser = await user.save();
    res.status(SUCCESS_HTTP_STATUS);
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      paypalEmail: updatedUser.paypalEmail,
      isShop: updatedUser.isShop,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("User not found");
  }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, paypalEmail, isShop } = req.body;
  let avatarUrl = req.body.avatarUrl;

  if (!name) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Name is required");
  }

  if (!password) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Password is required");
  }

  if (isShop) {
    if (!paypalEmail) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Paypal Email is required for shop");
    } else {
      if (!emailValidate(paypalEmail)) {
        res.status(FAIL_HTTP_STATUS);
        throw new Error("Paypal Email format is not right");
      }
    }
  }

  if (!email) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Email is required for shop");
  } else {
    if (!emailValidate(email)) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Email format is not right");
    }
  }

  if (avatarUrl) {
    try {
      await fs.promises.access(
        `${__dirname.replace("\\controllers", "")}${avatarUrl}`,
        fs.constants.F_OK,
        (err) => {}
      );
    } catch (error) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Avatar URL is not correct");
    }
  } else {
    avatarUrl = "/uploads/defaultAvatar.png";
  }

  const userExists = await UserModel.findOne({ email: sanitize(email) });
  if (userExists) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("User already registered");
  }

  const user = await UserModel.create({
    name: sanitize(name),
    password: sanitize(password),
    email: sanitize(email),
    paypalEmail: sanitize(paypalEmail),
    isShop: sanitize(isShop),
    avatarUrl: sanitize(avatarUrl),
  });

  if (user) {
    res.status(SUCCESS_HTTP_STATUS);
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isShop: user.isShop,
      token: generateToken(user.id),
    });
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Invalid user data");
  }
});

// @desc Gets all users profile
// @route GET /api/users/(:id)
// @access Private
export const getUsersAdmin = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber);
  const sId = req.params.id ? req.params.id : null;
  if (!sId) {
    const count = await UserModel.countDocuments(sId);
    const users = await UserModel.find(sId)
      .select("-password")
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(SUCCESS_HTTP_STATUS);
    return res.json({ users, page, pages: Math.ceil(count / pageSize) });
  } else {
    const user = await UserModel.findById(sId).select("-password");
    if (user) {
      res.status(SUCCESS_HTTP_STATUS);
      return res.json({ user });
    } else {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("User not found");
    }
  }
});
