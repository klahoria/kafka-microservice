import Fastify from "fastify";
import jwt from "@fastify/jwt";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { pool } from "../../../shared/db.js";

const app = Fastify();
app.register(jwt, { secret: "supersecret" });

app.post("/signup", async (req, reply) => {
    const { email, password } = req.body as any;

    const hashed = await bcrypt.hash(password, 12);

    await pool.execute(
        "INSERT INTO users (id,email,password) VALUES (?,?,?)",
        [uuid(), email, hashed]
    );

    return { success: true };
});

app.post("/login", async (req, reply) => {
    const { email, password } = req.body as any;

    const [rows]: any = await pool.execute(
        "SELECT * FROM users WHERE email=?",
        [email]
    );

    if (!rows.length) return reply.code(401).send();

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return reply.code(401).send();

    const token = app.jwt.sign({ id: rows[0].id });

    return { token };
});

app.listen({ port: 4001 });