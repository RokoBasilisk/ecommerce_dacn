import amqp from "amqplib";

import { consumeMessagesFromQueue } from "./utils/amqpHandle.js";
import { exchangeNameEnum, routingKeyEnum } from "./constanst/AmqpEnum.js";

const onJoin = (userId, socket, connectedUsers, channel, waitingMessageMap) => {
  if (!connectedUsers.get(userId)) {
    connectedUsers.set(userId, socket.id);
    console.log(`${userId} connect to server`);
    socket.emit(userId);
    onWaitingOrder(userId, socket, channel, waitingMessageMap);
  }
};

const onWaitingOrder = async (userId, socket, channel, waitingMessageMap) => {
  const shopExchangeMap = waitingMessageMap.get(userId);
  let routingKey;
  for (let exchangeKey of Object.keys(routingKeyEnum)) {
    routingKey = exchangeNameEnum.NOTIFICATION + "_" + exchangeKey;
    const exchangeOrderArray = shopExchangeMap?.get(routingKey);
    if (shopExchangeMap && exchangeOrderArray) {
      for (let orderId of exchangeOrderArray) {
        await consumeMessagesFromQueue(
          exchangeNameEnum.NOTIFICATION,
          exchangeKey + "_" + userId,
          orderId,
          socket,
          channel
        );
        const excludeExchangeOrderArray = exchangeOrderArray.filter(
          (e) => orderId !== e
        );
        if (excludeExchangeOrderArray.length != 0) {
          shopExchangeMap.delete(routingKey);
        } else {
          shopExchangeMap.set(routingKey, exchangeOrderArray);
        }
      }
    }
  }
};

const onAddOrder = async (userId, socket, channel, connectedUsers) => {
  if (connectedUsers.has(userId)) {
    console.log(connectedUsers, userId);

    await consumeMessagesFromQueue(
      exchangeNameEnum.NOTIFICATION,
      routingKeyEnum.ADD_ORDER + "_" + userId,
      "",
      socket,
      channel
    );
  }
};

const onPayOrder = (userId, socket, channel, connectedUsers) => {
  if (connectedUsers.has(userId)) {
    consumeMessagesFromQueue(
      exchangeNameEnum.NOTIFICATION,
      routingKeyEnum.PAY_ORDER + "_" + userId,
      "",
      socket,
      channel
    );
  }
};

const onUpdateOrder = (userId, socket, channel, connectedUsers) => {
  if (connectedUsers.has(userId)) {
    consumeMessagesFromQueue(
      exchangeNameEnum.NOTIFICATION,
      routingKeyEnum.UPDATE_ORDER + "_" + userId,
      "",
      socket,
      channel
    );
  }
};

const onHistoryOrder = (userId, socket, channel, connectedUsers) => {
  if (connectedUsers.has(userId)) {
  }
};

const onDisconnected = (channel, connection, socket, connectedUsers) => {
  for (let [key, value] of connectedUsers.entries()) {
    if (socket.id === value) {
      connectedUsers.delete(key);
      console.log(`${key} Client disconnected`);

      if (channel) {
        channel.close();
      }
      if (connection) {
        connection.close();
      }
    }
  }
};

export const socketHandle = (io, waitingMessageMap) => {
  const connectedUsers = new Map();
  io.on("connection", async (socket) => {
    const connection = await amqp.connect(process.env.AMQP_URI);
    const channel = await connection.createChannel();
    socket.on("join", (userId) =>
      onJoin(userId, socket, connectedUsers, channel, waitingMessageMap)
    );
    socket.on(
      exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.ADD_ORDER,
      (userId) => onAddOrder(userId, socket, channel, connectedUsers)
    );
    socket.on(
      exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.PAY_ORDER,
      async (userId) => onPayOrder(userId, socket, channel, connectedUsers)
    );

    socket.on(
      exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.UPDATE_ORDER,
      async (userId) => onUpdateOrder(userId, socket, channel, connectedUsers)
    );

    socket.on(
      exchangeNameEnum.NOTIFICATION + "_" + routingKeyEnum.HISTORY_ORDER,
      async (userId) => onHistoryOrder(userId, socket, channel, connectedUsers)
    );

    socket.on("disconnect", async () =>
      onDisconnected(channel, connection, socket, connectedUsers)
    );
  });
};
