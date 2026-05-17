import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    env: {
      DATABASE_URL: "postgresql://postgres:admin123@localhost:5432/plataforma_inmobiliaria_test",
    },
    setupFiles: ["dotenv/config"],
  },
});
