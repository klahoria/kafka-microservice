import Fastify from "fastify";
import { pool } from "../../../shared/db.js";
import { v4 as uuid } from "uuid";

const app = Fastify();

app.post("/comments", async (req) => {
  const { videoId, userId, content, parentId } = req.body as any;

  await pool.execute(
    "INSERT INTO comments (id,video_id,user_id,content,parent_id) VALUES (?,?,?,?,?)",
    [uuid(), videoId, userId, content, parentId || null]
  );

  return { success: true };
});

app.get("/comments/:videoId", async (req) => {
  const { videoId } = req.params as any;

  const [rows]: any = await pool.execute(
    "SELECT * FROM comments WHERE video_id=? ORDER BY created_at DESC",
    [videoId]
  );

  return rows;
});

app.listen({ port: 4004 });