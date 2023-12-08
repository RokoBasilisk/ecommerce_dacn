const onJoin = (userId, socket, connectedUsers) => {
  if (!connectedUsers.get(userId)) {
    connectedUsers.set(userId, socket.id);
    console.log(`${userId} connect to server`);
    socket.emit(userId);
  }
};

const onAddOrder = (userId, socket, channel, connectedUsers) => {
  if (connectedUsers.has(userId)) {
    consumeMessagesFromQueue(
      exchangeNameEnum.NOTIFICATION,
      routingKeyEnum.ADD_ORDER + "_" + key,
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
      routingKeyEnum.PAY_ORDER + "_" + key,
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
      routingKeyEnum.UPDATE_ORDER + "_" + key,
      "",
      socket,
      channel
    );
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

export const socketHandle = (io) => {
  const connectedUsers = new Map();
  io.on("connection", async (socket) => {
    const connection = await amqp.connect(process.env.AMQP_URI);
    const channel = await connection.createChannel();
    socket.on("join", (userId) => onJoin(userId, socket, connectedUsers));
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

    socket.on("disconnect", async () =>
      onDisconnected(channel, connection, socket, connectedUsers)
    );
  });
};
