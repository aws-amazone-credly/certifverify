import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Remplace "certverify" par le nom exact de ton repo GitHub
export default defineConfig({
  plugins: [react()],
  base: "/aws-amazone-credly/",
});
