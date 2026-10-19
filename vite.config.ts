import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const unexpected = Object.keys(env).filter(key => !['VITE_PAPER_URL', 'VITE_BASE_PATH'].includes(key));
  if (unexpected.length) throw new Error('Only VITE_PAPER_URL and VITE_BASE_PATH are allowed public build variables.');
  return { plugins: [react()], base: env.VITE_BASE_PATH || './', build: { sourcemap: false } };
});
