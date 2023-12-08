import { io } from "socket.io-client";
import { prefixAPI } from "./types";

export const socket = io(prefixAPI, {
  autoConnect: false,
  transports: ["websocket"],
});
