import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);
  socket.emit("chat:join", { roomId: "room-1" });
  socket.emit("chat:message", { roomId: "room-1", text: "it's working!" });
});

socket.on("chat:history", (data) => {
  console.log("History:", data);
});

socket.on("chat:new-message", (data) => {
  console.log("Message received:", data);
});
