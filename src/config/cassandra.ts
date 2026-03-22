import { Client } from "cassandra-driver";

const DEFAULT_CONTACT_POINTS = ["127.0.0.1"];
const DEFAULT_LOCAL_DATA_CENTER = "datacenter1";
const DEFAULT_KEYSPACE = "chat_app";
const DEFAULT_MESSAGE_TABLE = "messages";

let cassandraClient: Client | null = null;

function getContactPoints() {
  const value = process.env.CASSANDRA_CONTACT_POINTS;

  if (!value) {
    return DEFAULT_CONTACT_POINTS;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLocalDataCenter() {
  return process.env.CASSANDRA_DATACENTER || DEFAULT_LOCAL_DATA_CENTER;
}

export function getKeyspaceName() {
  return process.env.CASSANDRA_KEYSPACE || DEFAULT_KEYSPACE;
}

export function getMessageTableName() {
  return process.env.CASSANDRA_MESSAGES_TABLE || DEFAULT_MESSAGE_TABLE;
}

function getClient() {
  if (!cassandraClient) {
    cassandraClient = new Client({
      contactPoints: getContactPoints(),
      localDataCenter: getLocalDataCenter(),
    });
  }

  return cassandraClient;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function createSchema(client: Client) {
  const keyspace = getKeyspaceName();
  const table = getMessageTableName();

  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS ${keyspace}.${table} (
      room_id text,
      created_at timestamp,
      message_id timeuuid,
      sender_id text,
      text text,
      PRIMARY KEY ((room_id), created_at, message_id)
    ) WITH CLUSTERING ORDER BY (created_at DESC, message_id DESC)
  `);
}

export async function connectToCassandra(maxAttempts: number = 30) {
  const client = getClient();

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await client.connect();
      await createSchema(client);
      console.log("Cassandra connected successfully.");
      return client;
    } catch (error) {
      console.error(`Failed to connect to Cassandra (attempt ${attempt}/${maxAttempts}).`, error);

      if (attempt === maxAttempts) {
        throw error;
      }

      await sleep(5000);
    }
  }

  throw new Error("Cassandra connection failed.");
}

export function getCassandraClient() {
  return getClient();
}
