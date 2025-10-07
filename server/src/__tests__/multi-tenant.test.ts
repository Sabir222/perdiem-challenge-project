import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import { extractStoreFromSubdomain } from "../middleware";
import storeRoutes from "../routes/store";
import { generateToken } from "../utils/auth";
import pool from "../db/connection";

const app = express();
app.use(cors());
app.use(express.json());
app.use(extractStoreFromSubdomain);
app.use("/", storeRoutes);

describe("Multi-Tenant Isolation", () => {
  let storeAToken: string;
  let storeBToken: string;
  let storeAUserId: string;
  let storeBUserId: string;
  let storeAId: string;
  let storeBId: string;

  beforeAll(async () => {
    const storeA = await pool.query("SELECT id FROM stores WHERE slug = $1", [
      "a",
    ]);
    const storeB = await pool.query("SELECT id FROM stores WHERE slug = $1", [
      "b",
    ]);

    storeAId = storeA.rows[0].id;
    storeBId = storeB.rows[0].id;

    const signupA = await request(app)
      .post("/signup")
      .set("Host", "a.localhost:4000")
      .send({ email: "usera@test.com", password: "Password123!" });

    storeAToken = signupA.body.token;
    storeAUserId = signupA.body.user.id;

    const signupB = await request(app)
      .post("/signup")
      .set("Host", "b.localhost:4000")
      .send({ email: "userb@test.com", password: "Password123!" });

    storeBToken = signupB.body.token;
    storeBUserId = signupB.body.user.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email IN ($1, $2)", [
      "usera@test.com",
      "userb@test.com",
    ]);
  });

  test("Store A user cannot access Store B with their token", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Host", "b.localhost:4000")
      .set("Authorization", `Bearer ${storeAToken}`)
      .expect(403);

    expect(response.body.error).toContain("does not belong to this store");
  });

  test("Store B user cannot access Store A with their token", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Host", "a.localhost:4000")
      .set("Authorization", `Bearer ${storeBToken}`)
      .expect(403);

    expect(response.body.error).toContain("does not belong to this store");
  });

  test("Users can successfully access their own store", async () => {
    const responseA = await request(app)
      .get("/profile")
      .set("Host", "a.localhost:4000")
      .set("Authorization", `Bearer ${storeAToken}`)
      .expect(200);

    expect(responseA.body.id).toBe(storeAUserId);
    expect(responseA.body.email).toBe("usera@test.com");

    const responseB = await request(app)
      .get("/profile")
      .set("Host", "b.localhost:4000")
      .set("Authorization", `Bearer ${storeBToken}`)
      .expect(200);

    expect(responseB.body.id).toBe(storeBUserId);
    expect(responseB.body.email).toBe("userb@test.com");
  });

  test("Token with manipulated storeId is rejected", async () => {
    const maliciousToken = generateToken(storeAUserId, storeBId);

    const response = await request(app)
      .get("/profile")
      .set("Host", "b.localhost:4000")
      .set("Authorization", `Bearer ${maliciousToken}`)
      .expect(404);

    expect(response.body.error).toBe("User not found");
  });
});
