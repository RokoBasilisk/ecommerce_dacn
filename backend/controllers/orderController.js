import mercadopago from "mercadopago";
import asyncHandler from "express-async-handler";
import OrderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import sanitize from "../utils/sanitize.js";
import Mongoose from "mongoose";
import axios from "axios";
import {
  FAIL_HTTP_STATUS,
  SUCCESS_HTTP_STATUS,
} from "../constanst/ResultResponse.js";

const apiUrl = "https://api-m.sandbox.paypal.com/v1/payments/payouts";

// @desc Create new order
// @route POST /api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  let iArr = [];
  let itemsPrice = 0;

  if (orderItems && Object.keys(orderItems).length === 0) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("No items in this order");
  } else {
    for (let item of Object.keys(orderItems)) {
      let quantity = orderItems[item];
      await ProductModel.findById(sanitize(item))
        .then((res) => {
          iArr.push({
            productId: res._id,
            unitPrice: res.unitPrice,
            quantity: quantity,
          });
          itemsPrice += res.unitPrice * quantity;
        })
        .catch((err) => {
          res.status(FAIL_HTTP_STATUS);
          throw new Error("Item in order not found, try again later");
        });
    }

    // price more than 100 is freeship
    let shippingPrice = +itemsPrice > 100 ? 0 : 10;
    let taxPrice = Number(0.15 * +itemsPrice).toFixed(2);
    let totalPrice = +itemsPrice + +taxPrice + +shippingPrice;
    var order = new OrderModel({
      user: req.user._id,
      orderItems: iArr,
      shippingAddress: sanitize(shippingAddress),
      paymentMethod: sanitize(paymentMethod || "PayPal"),
      itemsPrice: sanitize(itemsPrice),
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(SUCCESS_HTTP_STATUS).json({
      success: true,
      orderId: createdOrder._id,
      totalPrice: createdOrder.totalPrice,
    });
  }
});

// @desc Update order to paid
// @route PATCH /api/orders/:orderId/payout
// @access Private
export const payoutForShop = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId) {
    return res
      .status(FAIL_HTTP_STATUS)
      .json({ success: false, message: "orderId is not found" });
  }

  const order = await OrderModel.findById(orderId)
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "productId",
        populate: {
          path: "user",
          select: "-password",
        },
      },
    });

  if (order) {
    if (order.paymentResult) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Order already paid");
    }
  }

  const sellerMoney = {};
  for (let product of order.orderItems) {
    if (!sellerMoney[product.productId.user._id]) {
      sellerMoney[product.productId.user._id] = {
        total: 0,
        receiver: product.productId.user.paypalEmail,
      };
    }
    sellerMoney[product.productId.user._id]["total"] +=
      product.unitPrice * product.quantity;
  }

  const items = [];

  for (let seller of Object.keys(sellerMoney)) {
    items.push({
      recipient_type: "EMAIL",
      amount: {
        value: sellerMoney[seller]["total"],
        currency: "USD",
      },
      note: "Thanks for your patronage!",
      sender_item_id: "201403140001",
      receiver: sellerMoney[seller]["receiver"],
    });
  }

  const jsonPayload = {
    sender_batch_header: {
      sender_batch_id: `Payouts_2023_${orderId}`,
      email_subject: "You have a payout!",
      email_message:
        "You have received a payout! Thanks for using our service!",
    },
    items: items,
  };

  const authHeader = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${authHeader}`,
  };

  axios
    .post(apiUrl, jsonPayload, { headers })
    .then((response) => {
      const date = new Date();
      const paymentResult = {
        payout_batch_id: response.data.batch_header.payout_batch_id,
        batch_status: "SUCCESS",
        update_time: date,
      };
      order.paymentResult = paymentResult;
      order.isPaid = true;
      order.paidAt = date;
      order.save();
      res.status(SUCCESS_HTTP_STATUS);
      return res.json({ success: true });
    })
    .catch((error) => {
      res.status(FAIL_HTTP_STATUS);
      return res.json(error);
      // Handle errors
    });
});

// @desc Gets order by id
// @route GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  if (!Mongoose.Types.ObjectId.isValid(sanitize(req.params.id))) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Order not found");
  }
  const order = await OrderModel.findById(sanitize(req.params.id)).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(SUCCESS_HTTP_STATUS);
    res.json(order);
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Order not found");
  }
});

// @desc Get all orders
// @route GET /api/orders/:id
// @access Private
export const getAllOrders = asyncHandler(async (req, res) => {
  // get all product is created by shop and exist in order
  const productsByShop = await ProductModel.aggregate([
    {
      $match: {
        user: Mongoose.Types.ObjectId(req.user._id), // Match documents where the user matches req.user._id
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "orders", // Assuming the collection name for orders is "orders"
        localField: "_id",
        foreignField: "orderItems.productId",
        as: "matchedOrders", // Create a field to hold matched orders
      },
    },
    {
      $match: {
        matchedOrders: { $ne: [] }, // Filter documents where there are matched orders
      },
    },
    {
      $project: {
        _id: 1, // Project only the _id field
      },
    },
  ]);

  // Get all order that exist product is created by shop
  const orders = await OrderModel.aggregate([
    {
      $match: {
        "orderItems.productId": { $in: productsByShop.map((e) => e._id) }, // Match orders with product IDs in the provided array
      },
    },
    {
      $unwind: "$orderItems", // Unwind the orderItems array
    },
    {
      $match: {
        "orderItems.productId": { $in: productsByShop.map((e) => e._id) }, // Match orderItems with product IDs in the provided array
      },
    },
    {
      $group: {
        _id: "$_id",
        orderItems: { $push: "$orderItems" },
        taxPrice: { $first: "$taxPrice" },
        shippingPrice: { $first: "$shippingPrice" },
        totalPrice: { $first: "$totalPrice" },
        isPaid: { $first: "$isPaid" },
        isDelivered: { $first: "$isDelivered" },
        shippingAddress: { $first: "$shippingAddress" },
        paymentMethod: { $first: "$paymentMethod" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  ]);

  // populate orderItems.productId
  for (let order of orders) {
    for (let orderItem of order.orderItems) {
      orderItem.product = await ProductModel.findById(
        orderItem.productId
      ).select(["_id", "name", "image"]);
      delete orderItem.productId;
      delete orderItem._id;
    }
  }

  if (orders) {
    res.status(SUCCESS_HTTP_STATUS);
    res.json(orders);
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Order not found");
  }
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
export const putUpdateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(sanitize(req.params.id));

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(SUCCESS_HTTP_STATUS);
    res.json(updatedOrder);
  } else {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Order not found");
  }
});

// @desc Get logged user orders
// @route GET /api/orders/myorders
// @access Private
export const getOrderUserOrders = asyncHandler(async (req, res) => {
  const order = await OrderModel.find({ user: req.user._id });
  res.status(SUCCESS_HTTP_STATUS);
  res.json(order);
});
