// src/main.tsx (또는 src/index.tsx)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 이 임포트가 있어야 합니다.
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* App 컴포넌트를 <BrowserRouter>로 감싸야 합니다. */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);