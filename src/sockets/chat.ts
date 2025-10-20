import { Server, Socket } from "socket.io";

export function registerChatHandlers(io: Server, socket: Socket) {
  socket.on("chat:message", (data) => {
    console.log("📩 Mensagem recebida:", data);

    socket.broadcast.emit("chat:message", data);
  });
}