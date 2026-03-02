import Fastify from "fastify";
import Redis from "ioredis";

const app = Fastify();
const redis = new Redis();

app.post("/view", async (req) => {
  const { videoId, userId, ip } = req.body as any;

  const key = `view:${videoId}:${userId || ip}`;

  const exists = await redis.get(key);
  if (exists) return { counted: false };

  await redis.set(key, "1", "EX", 300); // 5 min dedupe
  await redis.incr(`video:${videoId}:views`);

  return { counted: true };
});

app.listen({ port: 4009 });