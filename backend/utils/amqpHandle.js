import amqp from "amqplib";

export const sendMessageToQueue = async (
  exchangeName,
  routingKey,
  queueName,
  message
) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.AMQP_URI);
    const channel = await connection.createChannel();

    // Assert the exchange
    await channel.assertExchange(exchangeName, "direct", { durable: false });

    // Assert the queue
    await channel.assertQueue(queueName, {
      durable: false,
    });

    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(queueName, exchangeName, routingKey);

    // Send message to the queue
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    console.log(
      `Message sent to queue '${queueName}' in exchange '${exchangeName}' with routing key '${routingKey}': ${message}`
    );

    // Close the channel and the connection
    setTimeout(() => {
      connection.close();
    }, 500); // Closing the connection after a delay
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

export const consumeMessagesFromQueue = async (
  exchangeName,
  routingKey,
  queueName,
  socket,
  channel
) => {
  try {
    // Assert the exchange and queue
    await channel.assertExchange(exchangeName, "direct", { durable: false });
    const assertQueue = await channel.assertQueue(queueName, {
      exclusive: true,
    });

    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(assertQueue.queue, exchangeName, routingKey);
    console.log("bind queue with", exchangeName, routingKey);
    // Consume messages from the queue
    channel.consume(
      assertQueue.queue,
      async (message) => {
        if (message) {
          console.log(assertQueue);
          console.log(`Received message: ${message.content.toString()}`);
          const _id = JSON.parse(message.content.toString())._id;
          // Process the message here
          socket.emit(
            exchangeName + "_" + routingKey,
            JSON.parse(message.content.toString())
          );

          // Acknowledge the message
          channel.ack(message);
          await channel.deleteQueue(_id);
        }
      },
      { noAck: false }
    ); // Ensure messages are acknowledged after consumption
  } catch (error) {
    console.error("Oops! Something went wrong:", error);
  }
};
