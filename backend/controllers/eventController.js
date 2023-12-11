import eventRepository from "../repository/eventRepository.js";
import asyncHandler from "express-async-handler";

export const getShopEvent = asyncHandler(async (req, res) => {
  const shopEvents = await eventRepository.get({ eventTargetId: req.user._id });

  res.status(SUCCESS_HTTP_STATUS);
  res.json({ events: shopEvents });
});
