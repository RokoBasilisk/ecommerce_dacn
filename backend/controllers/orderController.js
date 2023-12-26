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
import { sendMessageToQueue } from "../utils/amqpHandle.js";
import { exchangeNameEnum, routingKeyEnum } from "../constanst/AmqpEnum.js";
import eventRepository from "../repository/eventRepository.js";

const apiUrl = "https://api-m.sandbox.paypal.com/v1/payments/payouts";

// @desc Create new order
// @route POST /api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;
  let orderItems = [];
  let itemsPrice = 0;

  // Validate products
  if (products && products.length === 0) {
    console.log("no Items")
    res.status(FAIL_HTTP_STATUS);
    throw new Error("No items in this order");
  } else {
    // loop through every product in cart
    for (let { productId, quantity } of products) {
      await ProductModel.findById(sanitize(productId)) // get product by item to calculate total money
        .then((res) => {
          orderItems.push({
            productId: productId,
            unitPrice: res.unitPrice,
            quantity: quantity,
          }); // add product to order
          itemsPrice += res.unitPrice * quantity; // calculate total money with formula: unitPrice * quantity
        })
        .catch((err) => {
          res.status(FAIL_HTTP_STATUS);
          console.log("Item in order not found, try again later")
          throw new Error("Item in order not found, try again later");
        });
    }

    var order = new OrderModel({
      user: req.user._id,
      orderItems: orderItems,
      shippingAddress: sanitize(shippingAddress),
      paymentMethod: sanitize(paymentMethod || "PayPal"),
      totalPrice: sanitize(itemsPrice),
    });
    const createdOrder = await order.save();
    console.log("save success")
    await eventRepository.add({
      eventTargetId: req.user._id,
      eventName: "addOrderItems",
      eventContext: `Add Order ${createdOrder._id} by ${req.user.name}`,
      aggregateData: JSON.stringify(createdOrder),
    });
    await createdOrder
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          populate: {
            path: "user",
            select: "-password",
          },
        },
      })
      .execPopulate();

    const shopIdsList = [];
    for (let {
      productId: {
        user: { _id },
      },
    } of createdOrder.orderItems) {
      const shopId = _id.toString();
      const orderId = createdOrder._id.toString();
      if (!shopIdsList.includes(shopId)) {
        shopIdsList.push(shopId);
        sendMessageToQueue(
          exchangeNameEnum.NOTIFICATION,
          routingKeyEnum.ADD_ORDER + "_" + shopId,
          orderId,
          JSON.stringify({
            _id: orderId,
            message: `You have new order ${orderId}`,
          })
        );
        // Map<String, Map<String, Array>>
        // shopId: String
        // exchangeOrder: Map
        // ExchangeType: String
        // orderList: Array
        const routingKey =
          exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.ADD_ORDER;
        const shopExchangeMap = req.waitingMessageMap.get(shopId);
        const exchangeOrderArray = shopExchangeMap?.get(routingKey);

        if (shopExchangeMap && exchangeOrderArray) {
          exchangeOrderArray.push(orderId);
          shopExchangeMap.set(shopId, exchangeOrderArray);
        } else {
          const typeMap = new Map();
          typeMap.set(routingKey, [orderId]);
          req.waitingMessageMap.set(shopId, typeMap);
        }
      }
    }

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
    res.status(FAIL_HTTP_STATUS);
    throw new Error("orderId is a must");
  }

  // validate orderId is match ObjectId type.
  if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error(`Wrong type of orderId with ${orderId}`);
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

  if (!order) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error(`Order ${orderId} is not found`);
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("You must be the one who order.");
  }

  if (order) {
    if (order.paymentResult.payout_batch_id) {
      res.status(FAIL_HTTP_STATUS);
      throw new Error("Order already paid.");
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
    .then(async (response) => {
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
      for (let _id of Object.keys(sellerMoney)) {
        await eventRepository.add({
          eventTargetId: _id,
          eventName: "payoutForShop",
          eventContext: `Transfer money by ${req.user.name}`,
          aggregateData: JSON.stringify(order),
        });
        sendMessageToQueue(
          exchangeNameEnum.NOTIFICATION,
          routingKeyEnum.PAY_ORDER + "_" + _id.toString(),
          order._id.toString(),
          JSON.stringify({
            _id: order._id.toString(),
            message: `You have new order ${order._id.toString()}`,
          })
        );
      }
      const routingKey =
        exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.PAY_ORDER;
      const shopExchangeMap = req.waitingMessageMap.get(shopId);
      const exchangeOrderArray = shopExchangeMap?.get(routingKey);

      if (shopExchangeMap && exchangeOrderArray) {
        exchangeOrderArray.push(orderId);
        shopExchangeMap.set(shopId, exchangeOrderArray);
      } else {
        const typeMap = new Map();
        typeMap.set(routingKey, [orderId]);
        req.waitingMessageMap.set(shopId, typeMap);
      }
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
// @route GET /api/orders/
// @access Private
export const getAllOrders = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.body.pageNumber) | 1;
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

  // Get total order that exist product is created by shop
  const count = await OrderModel.aggregate([
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
  ]).limit(pageSize)
  .skip(pageSize * (page - 1));

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
    res.json({orders: orders, page, pages: Math.ceil(count / pageSize)});
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
  if (!order) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Order not found");
  }
  if (order.isDelivered) {
    res.status(FAIL_HTTP_STATUS);
    throw new Error("Order is delivered!");
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  await eventRepository.add({
    eventTargetId: req.user._id,
    eventName: "putUpdateOrderToDelivered",
    eventContext: `Update Deliver Order by ${req.user.name}`,
    aggregateData: JSON.stringify(updatedOrder),
  });

  sendMessageToQueue(
    exchangeNameEnum.NOTIFICATION,
    routingKeyEnum.UPDATE_ORDER + "_" + updatedOrder.user.toString(),
    updatedOrder._id.toString(),
    JSON.stringify({
      _id: order._id.toString(),
      message: `Your order ${updatedOrder._id.toString()} have been update`,
    })
  );
  res.status(SUCCESS_HTTP_STATUS);
  res.json({ _id: updatedOrder._id, updatedAt: updatedOrder.updatedAt });
});

// @desc Get logged user orders
// @route GET /api/orders/myorders
// @access Private
export const getOrderUserOrders = asyncHandler(async (req, res) => {
  const order = await OrderModel.find({ user: req.user._id })
  .populate({
    path: "orderItems",
    populate: {
      path: "productId",
      select: "name image"
    },
  });
  res.status(SUCCESS_HTTP_STATUS);
  res.json({success: true, orders: order});
});
