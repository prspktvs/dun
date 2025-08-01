import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      'process.env': env,
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        // external: ['#minpath', '#minproc', '#minurl'],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // editor: ['@blocknote/core', '@blocknote/react', '@blocknote/mantine'],
            // prosemirror: ['prosemirror-state', 'prosemirror-view', 'prosemirror-model'],
          },
        },
      },
      optimizeDeps: {
        include: ['@blocknote/core'],
        exclude: [],
      },
      server: {
        open: true,
        host: true,
      },
    },
  }
})
