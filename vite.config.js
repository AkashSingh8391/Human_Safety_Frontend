import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  optimizeDeps: {
    include: ["sockjs-client", "stompjs"],
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
});
