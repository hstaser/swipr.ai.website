import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./", // Fix relative paths for deployment
  define: {
    // Ensure no eval usage in production
    global: "globalThis",
  },
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist", // Change output directory to standard dist for Vercel
    sourcemap: false, // Disable source maps to avoid CSP issues
    minify: "terser", // Use terser for better CSP compliance
    rollupOptions: {
      output: {
        // Ensure no eval usage in production
        format: "es",
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
    },
  },
  esbuild: {
    // Ensure CSP compliance
    legalComments: "none",
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  plugins: [
    react({
      // Ensure CSP compliance
      jsxRuntime: "automatic",
    }),
    ...(mode === "development" ? [expressPlugin()] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@src": path.resolve(__dirname, "./src"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
