import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { producer } from "../config/kafka";

export const register = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);

  const [result]: any = await pool.execute(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashed]
  );

  const userId = result.insertId;

  // 🔥 Emit Kafka event
  await producer.send({
    topic: "user.created",
    messages: [
      {
        value: JSON.stringify({
          userId,
          email,
          createdAt: new Date(),
        }),
      },
    ],
  });

  return { message: "User registered" };
};


export const login = async (email: string, password: string) => {
  const [rows]: any = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) throw new Error("User not found");

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return { token };
};