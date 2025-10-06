import { defineConfig } from "vitest/config";
import { config } from "dotenv";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.ts"],
    env: {
      ...config({ path: resolve(__dirname, ".env.test") }).parsed,
    },
  },
});
