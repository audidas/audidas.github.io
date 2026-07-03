import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// audidas.github.io 사용자 페이지 — 루트 도메인이므로 base는 "/"
export default defineConfig({
  plugins: [react()],
  base: "/",
});
