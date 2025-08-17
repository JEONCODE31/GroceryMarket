// src/App.tsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface DecodedToken {
  username?: string;
  email?: string;
  role?: string;
  exp: number;
  iat: number;
  sub: string; // 사용자 고유 ID(백엔드 발급 기준)
}

import VegetableandFruitPage from './pages/VegetableandFruitPage';
import MainHeader from './HomePage/MainHeader';
import LoginPageBody from './Login/LoginPageBody';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import ShoppingCart from './pages/ShoppingCart';
import OrderHistory from './pages/OrderHistory';
import CustomerSupportPage from './pages/CustomerSupportPage';
import ProductRegisterPage from './pages/ProductRegisterPage';
import VegetableandFruitDetailPage from './pages/VegetableandFruitDetailPage';
import ContactUsPage from './pages/ContactUsPage';

// Product 인터페이스
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  bestNumber: number;
}

interface CartItem extends Product {
  quantity: number;
}

function App(): React.ReactElement {
  useEffect(() => {
    console.log('VITE_GOOGLE_CLIENT_ID =', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  }, []);

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // ⬇️ 추가: userId 상태 (JWT의 sub 사용)
  const [userId, setUserId] = useState<string | null>(null);

  const decodeTokenAndSetUserStatus = (token: string | null): void => {
    if (!token) {
      setIsLoggedIn(false);
      setUsername(null);
      setIsAdmin(false);
      setUserId(null); // ⬅️ 토큰 없을 때 초기화
      return;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('App.tsx - Decoded Token:', decoded);

      if (decoded.exp * 1000 < Date.now()) {
        console.warn('Token expired. Logging out.');
        handleLogout();
        return;
      }

      setIsLoggedIn(true);
      setUsername(decoded.username || decoded.email || '사용자');
      setIsAdmin(decoded.role === 'admin');
      setUserId(decoded.sub || null); // ⬅️ 사용자 식별자 저장
    } catch (error) {
      console.error('JWT 토큰 디코딩 실패:', error);
      handleLogout();
    }
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const handleAddToCart = (productToAdd: Product): void => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
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
    setUserId(null); // ⬅️ 로그아웃 시 초기화
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <MainHeader
        isLoggedIn={isLoggedIn}
        username={username}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />

      <Routes>
        <Route path="/login" element={<LoginPageBody onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/HomePage" element={<HomePage isLoggedIn={isLoggedIn} username={username} />} />
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} username={username} />} />

        <Route
          path="/mypage"
          element={
            isLoggedIn ? (
              <MyPage isLoggedIn={isLoggedIn} username={username} isAdmin={isAdmin} />
            ) : (
              <div>
                로그인이 필요합니다. <Link to="/login">로그인하기</Link>
              </div>
            )
          }
        />

        <Route
          path="/orders"
          element={
            isLoggedIn ? (
              <OrderHistory isLoggedIn={isLoggedIn} username={username} />
            ) : (
              <div>
                로그인이 필요합니다. <Link to="/login">로그인하기</Link>
              </div>
            )
          }
        />

        <Route path="/cart" element={<ShoppingCart isLoggedIn={isLoggedIn} username={username} cartItems={cartItems} />} />
        <Route path="/customer-service" element={<CustomerSupportPage isLoggedIn={isLoggedIn} username={username} />} />

        <Route path="/vegetables-and-fruits" element={<VegetableandFruitPage onAddToCart={handleAddToCart} />} />
        <Route path="/vegetables-and-fruits/:productId" element={<VegetableandFruitDetailPage />} />

        {/* 신규: /contactus (로그인 필요) */}
        <Route
          path="/contactus"
          element={
            isLoggedIn ? (
              <ContactUsPage userId={userId ?? ''} userName={username ?? ''} />
            ) : (
              <div>
                로그인이 필요합니다. <Link to="/login">로그인하기</Link>
              </div>
            )
          }
        />

        <Route
          path="/ProductRegister"
          element={
            isAdmin ? (
              <ProductRegisterPage />
            ) : (
              <div>접근 권한이 없습니다. 관리자만 접근 가능합니다.</div>
            )
          }
        />

        <Route path="*" element={<div>페이지를 찾을 수 없습니다. (404 Not Found)</div>} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
