import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("User ", socket.id, " connected");
  const userId = socket.handshake.query?.userId;

  if (userId && typeof userId === "string") {
    userSocketMap[userId] = socket.id;
  } else {
    console.warn(
      "Invalid or missing userId in socket handshake query:",
      socket.handshake.query
    );
  }

  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  //broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User ", socket.id, " disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
