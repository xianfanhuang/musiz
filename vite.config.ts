import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/musiz/',  // 添加 GitHub Pages 子路径
  plugins: [vue()],
  build: {
    outDir: 'dist'  // 保持默认输出目录，与工作流匹配
  }
})