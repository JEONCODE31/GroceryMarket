// src/App.tsx

import React, { useState, useEffect } from 'react';
// BrowserRouter as Router 임포트를 제거하고, Routes, Route, useNavigate, Link만 남깁니다.
import { Routes, Route, useNavigate, Link } from 'react-router-dom'; // Router 임포트 제거 확인
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  username?: string;
  email?: string;
  role?: string;
  exp: number;
  iat: number;
  sub: string;
}

// 필요한 컴포넌트 임포트 확인 (MainHeader, LoginPageBody, HomePage, RegisterPage 등)
import MainHeader from './HomePage/MainHeader';
import LoginPageBody from './Login/LoginPageBody';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import ShoppingCart from './pages/ShoppingCart';
import OrderHistory from './pages/OrderHistory';
import CustomerSupportPage from './pages/CustomerSupportPage';
import ProductRegisterPage from './pages/ProductRegisterPage';
import VegetableandFruitPage from './pages/VegetableandFruitPage'; // ✨ VegetableandFruitPage 컴포넌트 임포트 추가

function App(): React.ReactElement {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const decodeTokenAndSetUserStatus = (token: string | null): void => {
    if (!token) {
      setIsLoggedIn(false);
      setUsername(null);
      setIsAdmin(false);
      return;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("App.tsx - Decoded Token:", decoded);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired. Logging out.");
        handleLogout();
        return;
      }

      setIsLoggedIn(true);
      setUsername(decoded.username || decoded.email || '사용자');
      setIsAdmin(decoded.role === 'admin');
    } catch (error) {
      console.error("JWT 토큰 디코딩 실패:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    const token: string | null = localStorage.getItem('accessToken');
    decodeTokenAndSetUserStatus(token);

    const handleStorageChange = (): void => {
      decodeTokenAndSetUserStatus(localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = (token: string): void => {
    localStorage.setItem('accessToken', token);
    decodeTokenAndSetUserStatus(token);
    navigate('/HomePage');
  };

  const handleLogout = (): void => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setUsername(null);
    setIsAdmin(false);
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    // ✨ 여기에 React Fragment를 추가합니다. (<Router>를 제거했으므로 필수입니다!)
    <> 
      {/* MainHeader는 모든 페이지에 걸쳐 동일하게 보이므로 <Routes> 밖에 배치합니다. */}
      {/* 필요한 전역 상태들을 props로 전달합니다. */}
      <MainHeader
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* 모든 주요 페이지 컴포넌트들을 <Routes> 안에 <Route>로 정의합니다. */}
      <Routes>
        <Route path="/login" element={<LoginPageBody onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/HomePage" element={<HomePage isLoggedIn={isLoggedIn} username={username} />} />
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} username={username} />} />
        <Route path="/mypage" element={
            isLoggedIn ? (
                <MyPage isLoggedIn={isLoggedIn} username={username} isAdmin={isAdmin} />
            ) : (
                <div>로그인이 필요합니다. <Link to="/login">로그인하기</Link></div>
            )
        } />
        <Route path="/cart" element={<ShoppingCart isLoggedIn={isLoggedIn} username={username} />} />
        <Route path="/orders" element={
            isLoggedIn ? (
                <OrderHistory isLoggedIn={isLoggedIn} username={username} />
            ) : (
                <div>로그인이 필요합니다. <Link to="/login">로그인하기</Link></div>
            )
        } />
        <Route path="/customer-service" element={<CustomerSupportPage isLoggedIn={isLoggedIn} username={username} />} />
        <Route path="/vegetables-and-fruits" element={<VegetableandFruitPage />} /> {/* ✨ VegetableandFruitPage 라우트 추가 */}
        <Route
          path="/ProductRegister"
          element={isAdmin ? <ProductRegisterPage /> : <div>접근 권한이 없습니다. 관리자만 접근 가능합니다.</div>}
        />
        <Route path="*" element={<div>페이지를 찾을 수 없습니다. (404 Not Found)</div>} />
      </Routes>
    </> // ✨ React Fragment 닫는 태그를 추가합니다.
  );
}

export default App;