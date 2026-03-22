import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerChatHandlers } from "./sockets/chat";
import user from "./routes/user";
import auth from "./routes/auth";
import { getAuthenticatedUserId } from "./utils/auth";

export function createServer() {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

  app.use(cors({
    origin: frontendOrigin,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.static("src/public"));
  app.use("/users", user);
  app.use("/auth", auth);
  
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: frontendOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = getAuthenticatedUserId(socket.handshake.headers.cookie);

    // if (!userId) {
    //   return next(new Error("Not authenticated"));
    // }

    socket.data.userId = userId || "1233321";
    next();
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
