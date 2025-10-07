import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const url = new URL(redisUrl);
const dbNumber =
  url.pathname && url.pathname !== "/"
    ? parseInt(url.pathname.substring(1))
    : 0;

const redisClient = createClient({
  url: redisUrl,
  database: dbNumber,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log(`Connected to Redis database ${dbNumber}`);
});

export default redisClient;

