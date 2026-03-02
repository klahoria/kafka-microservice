import Fastify from "fastify";
import { pool } from "../../../shared/db.js";
import { v4 as uuid } from "uuid";

const app = Fastify();

app.post("/videos", async (req) => {
    const { userId, title, description, url } = req.body as any;

    const id = uuid();

    await pool.execute(
        "INSERT INTO videos (id,user_id,title,description,url) VALUES (?,?,?,?,?)",
        [id, userId, title, description, url]
    );

    return { id };
});

app.get("/videos/:id", async (req) => {
    const { id } = req.params as any;

    const [rows]: any = await pool.execute(
        "SELECT * FROM videos WHERE id=?",
        [id]
    );

    return rows[0];
});

app.get("/stream/:videoId", async (req, reply) => {
    const { videoId } = req.params as any;
    return reply.sendFile(`./hls/${videoId}/index.m3u8`);
});

app.listen({ port: 4002 });