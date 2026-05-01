import { connectToCassandra } from "./config/cassandra";
import { createServer } from "./server";

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToCassandra();
  const server = createServer();

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server.", error);
  process.exit(1);
});
