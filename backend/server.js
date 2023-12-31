import path from "path";
import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";

import { basicInfo } from "./docs/basicInfo.js";
import connectDB from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { isCustomer, protect } from "./middleware/authMiddleware.js";
import { socketHandle } from "./socket.js";

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const waitingMessageMap = new Map();

socketHandle(io, waitingMessageMap);

app.use(morgan("short"));

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
  req.waitingMessageMap = waitingMessageMap;
  next();
});

app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/config/paypal", (req, res) =>
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID,
    secretKey: process.env.PAYPAL_CLIENT_SECRET,
  })
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
