import React, { useState, useEffect } from 'react';
import ShoppingCartFooter from '../ShoppingCart/ShoppingCartFooter';
import ShoppingCartBody from '../ShoppingCart/ShoppingCartBody';
import { useNavigate } from 'react-router-dom';

// 장바구니 아이템 상세 정보를 위한 인터페이스
interface CartItemDetailDto {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemDetailDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  // 장바구니 상품 목록을 불러오는 비동기 함수
  const fetchCartItems = async () => {
    // 토큰이 없을 경우, 로딩을 멈추고 함수 종료
    if (!token) {
      setLoading(false);
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        // 403 Forbidden 에러 처리: 권한이 없을 경우 사용자에게 알림
        if (response.status === 403) {
          alert('장바구니 정보를 불러올 권한이 없습니다. 다시 로그인해 주세요.');
        }
        throw new Error('Failed to fetch cart items');
      }

      const data: CartItemDetailDto[] = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  // 상품 금액을 계산하는 함수
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // 수량 변경 핸들러
  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    setCartItems(currentItems => 
      currentItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  // 상품 삭제 핸들러
  const handleRemoveItem = (cartItemId: number) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.cartItemId !== cartItemId)
    );
  };

  const subtotal = calculateSubtotal();
  const shippingFee = 0; // 배송비는 임시로 0으로 설정
  const totalAmount = subtotal + shippingFee;

  // 주문하기 버튼 클릭 핸들러 (더미)
  const handleOrderClick = () => {
    alert('주문하기 버튼이 클릭되었습니다.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">장바구니 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  // 토큰이 없어서 로그인이 필요한 경우
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-700 mb-4">로그인이 필요합니다.</div>
        <p className="text-gray-500">장바구니를 보려면 로그인해주세요.</p>
      </div>
    );
  }
  
  // 장바구니에 상품이 없는 경우 (토큰은 있지만 데이터가 없을 때)
  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">장바구니에 담긴 상품이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      <ShoppingCartBody 
        cartItems={cartItems} 
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={totalAmount}
      />
    </div>
  );
};

export default ShoppingCartPage;