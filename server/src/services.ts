import pool from "./db/connection";
import redisClient from "./redis/client";
import { Store, User } from "./models";
import bcrypt from "bcrypt";

export const storeService = {
  async getStoreBySlug(slug: string): Promise<Store | null> {
    const cachedStore = await redisClient.get(`store:${slug}`);
    if (cachedStore) {
      return JSON.parse(cachedStore);
    }

    const query = "SELECT * FROM stores WHERE slug = $1";
    const result = await pool.query(query, [slug]);

    if (result.rows.length) {
      await redisClient.setEx(
        `store:${slug}`,
        3600,
        JSON.stringify(result.rows[0]),
      );
      return result.rows[0];
    }

    return null;
  },
};

export const userService = {
  async createUser(
    email: string,
    password: string,
    store_id: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (id, email, password, store_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
      RETURNING *;
    `;
    const result = await pool.query(query, [email, hashedPassword, store_id]);
    return result.rows[0];
  },

  async getUserByEmailAndStore(
    email: string,
    store_id: string,
  ): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1 AND store_id = $2";
    const result = await pool.query(query, [email, store_id]);
    return result.rows.length ? result.rows[0] : null;
  },

  async getUserByIdAndStore(
    id: string,
    store_id: string,
  ): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1 AND store_id = $2";
    const result = await pool.query(query, [id, store_id]);
    return result.rows.length ? result.rows[0] : null;
  },
};
