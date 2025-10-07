import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import { extractStoreFromSubdomain } from "../middleware";
import storeRoutes from "../routes/store";
import { generateToken, verifyToken } from "../utils/auth";
import pool from "../db/connection";

const app = express();
app.use(cors());
app.use(express.json());
app.use(extractStoreFromSubdomain);
app.use("/", storeRoutes);

describe("Authentication & Authorization", () => {
  let validToken: string;
  let userId: string;
  let storeId: string;

  beforeAll(async () => {
    const signupResponse = await request(app)
      .post("/signup")
      .set("Host", "a.localhost:4000")
      .send({ email: "authtest@test.com", password: "Password123!" });

    validToken = signupResponse.body.data.token;
    userId = signupResponse.body.data.user.id;
    storeId = signupResponse.body.data.user.store_id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [
      "authtest@test.com",
    ]);
  });

  describe("Token Generation & Verification", () => {
    test("should generate a valid token", () => {
      const token = generateToken(userId, storeId);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("should verify a valid token", () => {
      const token = generateToken(userId, storeId);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.storeId).toBe(storeId);
    });

    test("should reject invalid token", () => {
      const invalidToken = "invalid.token.here";
      const decoded = verifyToken(invalidToken);
      expect(decoded).toBeNull();
    });
  });

  describe("Authentication Middleware", () => {
    test("should reject requests without authorization header", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Host", "a.localhost:4000")
        .expect(401);

      expect(response.body.error).toBe("Authentication token required");
    });

    test("should reject requests with malformed authorization header", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Host", "a.localhost:4000")
        .set("Authorization", "InvalidFormat")
        .expect(401);

      expect(response.body.error).toBe("Authentication token required");
    });

    test("should reject requests with invalid token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Host", "a.localhost:4000")
        .set("Authorization", "Bearer invalid.token.here")
        .expect(401);

      expect(response.body.error).toBe("Invalid or expired token");
    });

    test("should accept requests with valid token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Host", "a.localhost:4000")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe("authtest@test.com");
    });
  });

  describe("Protected Routes", () => {
    test("should protect profile route", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Host", "a.localhost:4000")
        .expect(401);

      expect(response.body.error).toBe("Authentication token required");
    });

    test("should allow access to profile with valid token", async () => {
      const response = await request(app)
        .get("/profile")
        .set("Host", "a.localhost:4000")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("email");
      expect(response.body.data).toHaveProperty("store_id");
    });
  });
});
