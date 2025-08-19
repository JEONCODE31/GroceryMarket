import React, { useState, useEffect } from 'react';
import ShoppingCartBody from '../ShoppingCart/ShoppingCartBody';
import { useNavigate } from 'react-router-dom';

// 아임포트 라이브러리를 전역에서 접근하기 위한 타입 선언
declare global {
  interface Window {
    IMP: any;
  }
}

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

  // 아임포트 초기화
  useEffect(() => {
    const { IMP } = window;
    if (IMP) {
      IMP.init('imp32172778'); // 가맹점 식별코드
    } else {
      console.error("아임포트 라이브러리가 로드되지 않았습니다.");
    }
  }, []);

  const fetchCartItems = async () => {
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
        if (response.status === 403) {
          alert('장바구니 정보를 불러올 권한이 없습니다. 다시 로그인해 주세요.');
        }
        throw new Error('Failed to fetch cart items');
      }

      const data: CartItemDetailDto[] = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [token]);

  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (cartItemId: number) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.cartItemId !== cartItemId)
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = 0; // 배송비는 0원으로 가정
  const totalAmount = subtotal + shippingFee;

  const handleOrderClick = () => {
    if (cartItems.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    const { IMP } = window;
    IMP.request_pay(
      {
        pg: 'danal_tpay',
        pay_method: 'card',
        merchant_uid: `mid_${new Date().getTime()}`,
        name: cartItems[0].productName + (cartItems.length > 1 ? ` 외 ${cartItems.length - 1}건` : ''),
        amount: totalAmount,
        buyer_email: localStorage.getItem('email') || '',
        buyer_name: localStorage.getItem('buyerName') || '',
        buyer_tel: '010-1234-5678', // 테스트용 전화번호
      },
      async (rsp: any) => {
        if (rsp.success) {
          try {
            // 주문 정보 백엔드에 전송
            const response = await fetch('http://localhost:8080/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                // 백엔드에서 필요한 주문 데이터 구조에 맞게 수정 필요
                // imp_uid와 merchant_uid는 결제 검증에 사용됨
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                cartItems: cartItems.map(item => ({
                  productId: item.productId,
                  quantity: item.quantity
                }))
              }),
            });

            if (response.ok) {
              // 주문 성공 시 로컬 캐시에 주문 정보 저장 (마이페이지 임시 사용)
              localStorage.setItem('lastPaidItems', JSON.stringify({
                at: new Date().toISOString(),
                items: cartItems,
                payment: {
                  impUid: rsp.imp_uid,
                  merchantUid: rsp.merchant_uid,
                  method: rsp.pay_method,
                }
              }));
              
              setCartItems([]);
              alert('결제가 완료되었습니다!');
              navigate('/mypage'); 
            } else {
              throw new Error('주문 데이터 서버 전송 실패');
            }
          } catch (error) {
            console.error('주문 처리 중 오류:', error);
            alert('결제는 성공했으나, 주문 처리 중 오류가 발생했습니다. 고객센터에 문의해주세요.');
          }

        } else {
          alert(`결제에 실패했습니다. 에러 내용: ${rsp.error_msg}`);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">장바구니 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-gray-700 mb-4">로그인이 필요합니다.</div>
        <p className="text-gray-500">장바구니를 보려면 로그인해주세요.</p>
      </div>
    );
  }
  
  return (
    <ShoppingCartBody 
      cartItems={cartItems} 
      onQuantityChange={handleQuantityChange} 
      onRemoveItem={handleRemoveItem} 
      subtotal={subtotal} 
      shippingFee={shippingFee}
      total={totalAmount}
      onOrderClick={handleOrderClick}
    />
  );
};

export default ShoppingCartPage;