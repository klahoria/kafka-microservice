import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "video_db",
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});