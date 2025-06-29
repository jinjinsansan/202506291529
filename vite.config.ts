import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // 本番ビルドの最適化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // チャンク分割の最適化
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs'],
          icons: ['lucide-react']
        }
      }
    }
  },
  // キャッシュの最適化
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
});