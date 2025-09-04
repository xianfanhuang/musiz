import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 当站点部署在 https://<user>.github.io/<repo>/ 时，需要设置 base 为 '/<repo>/'
  base: '/musiz/',
  plugins: [react()],
})