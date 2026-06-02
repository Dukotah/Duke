import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      // Mirror the tsconfig "@/*" path alias so tests can import app modules.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Pure logic only — runs in Node, no jsdom/browser env needed.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
