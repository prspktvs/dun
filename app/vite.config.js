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
        external: ['#minpath', '#minproc', '#minurl'],
      },
      optimizeDeps: {
        exclude: ['@blocknote/core'],
      },
    },
  }
})
