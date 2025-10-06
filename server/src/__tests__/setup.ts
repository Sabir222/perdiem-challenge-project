import { beforeAll, afterAll, afterEach } from "vitest";
import pool from "../db/connection";
import redisClient from "../redis/client";

beforeAll(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  await pool.query("DELETE FROM users WHERE email LIKE '%@test.com'");
});

afterAll(async () => {
  await redisClient.quit();
  await pool.end();
});

afterEach(async () => {
  if (redisClient.isOpen) {
    await redisClient.flushDb();
  }
});
