import { io } from "socket.io-client";

const SERVER_URL = process.env.SERVER_URL || "http://192.168.0.105:3000";

export const socket = io(SERVER_URL);
