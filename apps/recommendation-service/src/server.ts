import Fastify from "fastify";
import Redis from "ioredis";

const app = Fastify();
const redis = new Redis();

function scoreVideo(v: any) {
  return (
    v.watchTime * 0.5 +
    v.likes * 0.2 +
    v.recencyScore * 0.2 +
    v.subscriptionBoost * 0.1
  );
}

app.get("/recommend/:userId", async (req) => {
  const { userId } = req.params as any;

  const videos = JSON.parse(await redis.get("video_features") || "[]");

  return videos
    .map((v: any) => ({ ...v, score: scoreVideo(v) }))
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 20);
});

app.listen({ port: 4008 });