import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as authController from "./controllers/authController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", authController.register);
app.post("/login", authController.login);

app.listen(process.env.PORT, () => {
  console.log(`Auth service running on port ${process.env.PORT}`);
});