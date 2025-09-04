import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Middleware to set the correct MIME type for .ts and .tsx files.
 * This is a workaround for an issue where the development server might
 * serve these files as 'application/octet-stream' in some environments,
 * causing the browser to refuse to execute them.
 */
const forceJsMimeTypePlugin = () => ({
  name: 'force-js-mime-type',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.originalUrl.endsWith('.ts') || req.originalUrl.endsWith('.tsx')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), forceJsMimeTypePlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
