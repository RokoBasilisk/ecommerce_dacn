import path from "path";
import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { basicInfo } from "./docs/basicInfo.js";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { isCustomer, protect } from "./middleware/authMiddleware.js";
import {
  consumeMessagesFromQueue,
  sendMessageToQueue,
} from "./utils/amqpHandle.js";
import { exchangeNameEnum, routingKeyEnum } from "./constanst/AmqpEnum.js";

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const connectedUsers = new Map();

io.on("connection", (socket) => {
  socket.on("join", async (userId) => {
    if (!connectedUsers.get(socket.id)) {
      connectedUsers.set(socket.id, userId);
      console.log(`${userId} connect to server`);
      socket.emit(userId);
    }
  });
  socket.on(
    exchangeNameEnum.NOTIFICATION + routingKeyEnum.ADD_ORDER,
    async () => {
      consumeMessagesFromQueue(
        exchangeNameEnum.NOTIFICATION,
        routingKeyEnum.ADD_ORDER,
        connectedUsers.get(socket.id),
        socket
      );
    }
  );

  socket.on("logout", () => {
    socket.emit("logout");
  });

  socket.on("disconnect", () => {
    let userId = connectedUsers.get(socket.id);
    if (userId) {
      connectedUsers.delete(socket.id);
      console.log(`${userId} Client disconnected`);
    }
  });
});

app.use(cors());

app.use(express.json());

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(basicInfo), {
    explorer: true,
  })
);

app.use((req, res, next) => {
  next();
});

app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/config/paypal", protect, isCustomer, (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve(); // Not avaliable because its using ESM
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Try hitting /API");
    console.warn("Hit the API!");
  });
}

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(
  PORT,
  console.log(`Server runing in ${process.env.NODE_ENV} on port ${PORT}`)
);

// server.listen(
//   PORT,
//   console.log(`socket server runing in ${process.env.NODE_ENV} on port ${PORT}`)
// );
