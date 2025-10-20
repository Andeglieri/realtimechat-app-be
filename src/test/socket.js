import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("🟢 Conectado com ID:", socket.id);

  socket.emit("chat:message", { message: "it's working!" });
});

socket.on("chat:message", (data) => {
  console.log("📩 Mensagem recebida:", data);
});
