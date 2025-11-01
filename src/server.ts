import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerChatHandlers } from "./sockets/chat";
import user from "./routes/user";
import auth from "./routes/auth";

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/users", user);
  app.use("/auth", auth);
  
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return httpServer;
}
