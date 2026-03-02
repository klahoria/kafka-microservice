import { createProxyMiddleware } from 'http-proxy-middleware';
import express from "express";
import cors from "cors";
import moragn from 'morgan';


const app = express();
const logger = moragn('dev');
app.use(cors());
app.use(logger);

// Route auth requests to auth-service
app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://auth-service:4001",
        changeOrigin: true,
    })
);

app.use(express.json());


app.listen(4000, () => {
    console.log("Gateway running on port 4000");
});