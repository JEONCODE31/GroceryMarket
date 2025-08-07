import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 프론트엔드 개발 서버 포트 설정
    port: 5173,
    // 프록시 설정 추가
    proxy: {
      // /api로 시작하는 요청을 http://localhost:8080으로 전달
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        // WebSocket도 프록시되도록 설정
        ws: true,
      }
    }
  }
})
