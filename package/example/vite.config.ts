import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";

export default defineConfig({
  plugins: [tanstackStart(), solid({ ssr: true })],
  optimizeDeps: {
    exclude: ["agentation-solid"],
  },
  server: {
    fs: {
      // Allow monorepo root so pnpm-linked deps (in node_modules/.pnpm/) are servable
      allow: ["../.."],
    },
  },
});
