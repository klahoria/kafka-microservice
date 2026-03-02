import Fastify from "fastify";
import { Client } from "@elastic/elasticsearch";

const app = Fastify();
const client = new Client({ node: "http://localhost:9200" });

app.post("/index", async (req) => {
  const { id, title, description } = req.body as any;

  await client.index({
    index: "videos",
    id,
    document: { title, description }
  });

  return { indexed: true };
});

app.get("/search", async (req) => {
  const { q } = req.query as any;

  const result = await client.search({
    index: "videos",
    query: {
      multi_match: {
        query: q,
        fields: ["title", "description"]
      }
    }
  });

  return result.hits.hits;
});

app.listen({ port: 4010 });