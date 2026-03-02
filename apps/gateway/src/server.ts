import Fastify from "fastify";
import proxy from "@fastify/http-proxy";

const app = Fastify();

app.register(proxy, {
  upstream: "http://localhost:4001",
  prefix: "/auth"
});

app.register(proxy, {
  upstream: "http://localhost:4002",
  prefix: "/videos"
});

app.register(proxy, {
  upstream: "http://localhost:4003",
  prefix: "/engagement"
});

app.register(proxy, {
  upstream: "http://localhost:4004",
  prefix: "/comments"
});

app.listen({ port: 3000 });