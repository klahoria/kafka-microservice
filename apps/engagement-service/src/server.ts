import Fastify from "fastify";
import Redis from "ioredis";

const redis = new Redis();
const app = Fastify();

app.post("/like", async (req) => {
  const { videoId, userId } = req.body as any;

  await redis.sadd(`video:${videoId}:likes`, userId);

  return {
    likes: await redis.scard(`video:${videoId}:likes`)
  };
});

app.post("/subscribe", async (req) => {
  const { channelId, userId } = req.body as any;

  await redis.sadd(`channel:${channelId}:subs`, userId);

  return {
    subscribers: await redis.scard(`channel:${channelId}:subs`)
  };
});

app.listen({ port: 4003 });