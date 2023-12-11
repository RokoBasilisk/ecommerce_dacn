import { SUCCESS_HTTP_STATUS } from "../constanst/ResultResponse.js";
import eventRepository from "../repository/eventRepository.js";
import asyncHandler from "express-async-handler";

export const getShopEvent = asyncHandler(async (req, res) => {
  try {
    const shopEvents = await eventRepository.get({
      eventTargetId: req.user._id,
    });
    res.status(SUCCESS_HTTP_STATUS);
    res.json({ events: shopEvents });
  } catch (error) {
    console.log(error);
  }
});
