"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.storeService = void 0;
const connection_1 = __importDefault(require("./db/connection"));
const client_1 = __importDefault(require("./redis/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.storeService = {
    async getStoreBySlug(slug) {
        const cachedStore = await client_1.default.get(`store:${slug}`);
        if (cachedStore) {
            return JSON.parse(cachedStore);
        }
        const query = "SELECT * FROM stores WHERE slug = $1";
        const result = await connection_1.default.query(query, [slug]);
        if (result.rows.length) {
            await client_1.default.setEx(`store:${slug}`, 3600, JSON.stringify(result.rows[0]));
            return result.rows[0];
        }
        return null;
    },
};
exports.userService = {
    async createUser(email, password, store_id) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const query = `
      INSERT INTO users (id, email, password, store_id, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
      RETURNING *;
    `;
        const result = await connection_1.default.query(query, [email, hashedPassword, store_id]);
        return result.rows[0];
    },
    async getUserByEmailAndStore(email, store_id) {
        const query = "SELECT * FROM users WHERE email = $1 AND store_id = $2";
        const result = await connection_1.default.query(query, [email, store_id]);
        return result.rows.length ? result.rows[0] : null;
    },
    async getUserByIdAndStore(id, store_id) {
        const query = "SELECT * FROM users WHERE id = $1 AND store_id = $2";
        const result = await connection_1.default.query(query, [id, store_id]);
        return result.rows.length ? result.rows[0] : null;
    },
};
