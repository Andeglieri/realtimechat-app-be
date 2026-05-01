import { Server, Socket } from "socket.io";
import { listRecentMessages, saveChatMessage } from "../repositories/chat-messages";

interface ChatMessageInput {
  roomId: string;
  text: string;
}

export function registerChatHandlers(io: Server, socket: Socket) {
  socket.on("chat:join", async ({ roomId }) => {
    if (!roomId) {
      socket.emit("chat:error", { message: "roomId is required" });
      return;
    }

    socket.join(roomId);

    try {
      const messages = await listRecentMessages(roomId);
      socket.emit("chat:history", messages);
    } catch (error) {
      console.error("Failed to load room history:", error);
      socket.emit("chat:error", { message: "Failed to load room history." });
    }

    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("chat:message", async (data: ChatMessageInput) => {
    if (!data.roomId || !data.text?.trim()) {
      socket.emit("chat:error", { message: "roomId and text are required" });
      return;
    }

    const messagePayload = {
      roomId: data.roomId,
      senderId: socket.data.userId as string,
      text: data.text.trim(),
      createdAt: new Date(),
    };

    try {
      const storedMessage = await saveChatMessage(messagePayload);
      io.to(data.roomId).emit("chat:new-message", storedMessage);
    } catch (error) {
      console.error("Failed to persist chat message:", error);
      socket.emit("chat:error", { message: "Failed to persist chat message." });
    }
  });

  socket.on("chat:leave", ({ roomId }) => {
    socket.leave(roomId);
  });
}
