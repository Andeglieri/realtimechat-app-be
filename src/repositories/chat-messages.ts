import { types } from "cassandra-driver";
import { getCassandraClient, getKeyspaceName, getMessageTableName } from "../config/cassandra";

export interface StoredChatMessage {
  roomId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  messageId: string;
}

const keyspace = getKeyspaceName();
const table = getMessageTableName();

export async function saveChatMessage(message: Omit<StoredChatMessage, "messageId">) {
  const client = getCassandraClient();
  const messageId = types.TimeUuid.now();

  await client.execute(
    `INSERT INTO ${keyspace}.${table} (room_id, created_at, message_id, sender_id, text) VALUES (?, ?, ?, ?, ?)`,
    [message.roomId, message.createdAt, messageId, message.senderId, message.text],
    { prepare: true },
  );

  return {
    ...message,
    messageId: messageId.toString(),
  };
}

export async function listRecentMessages(roomId: string, limit: number = 50): Promise<StoredChatMessage[]> {
  const client = getCassandraClient();
  const result = await client.execute(
    `SELECT room_id, created_at, message_id, sender_id, text FROM ${keyspace}.${table} WHERE room_id = ? LIMIT ?`,
    [roomId, limit],
    { prepare: true },
  );

  return result.rows
    .map((row) => ({
      roomId: row["room_id"] as string,
      senderId: row["sender_id"] as string,
      text: row.text as string,
      createdAt: row["created_at"] as Date,
      messageId: row["message_id"].toString(),
    }))
    .reverse();
}
