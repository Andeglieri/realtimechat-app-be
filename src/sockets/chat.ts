import { Server, Socket } from "socket.io";
interface ChatMessage {
  roomId: string;
  senderId: string;
  text: string;
  createdAt?: Date;
}

export function registerChatHandlers(io: Server, socket: Socket) {
  socket.on("chat:join", ({ roomId }) => {

  if (!roomId) {
    socket.emit("chat:error", { message: "roomId is required" });
    return
  }

  socket.join(roomId);
  console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("chat:message", (data: ChatMessage) => {
    console.log("📩 Menssage:", data);

    const message = {
      ...data,
      createdAt: new Date(),
    };

    io.to(data.roomId).emit("chat:new-message", message);
  });


  socket.on("chat:leave", ({ roomId }) => {
    socket.leave(roomId);
  });
}