// src/components/CartPage/ShoppingCartBody.tsx
import React, { useCallback } from 'react';
import styles from '../styles/CartPage/ShoppingCartBody.module.css';
import { loadIamportScript } from '../lib/loadIamport';

// ────────────────────────────────────────────────────────────────
// (선택) 다날 직연동 SDK 타입 – 네 프로젝트에 danal.d.ts가 없다면 여기 둬도 됩니다.
declare global {
  interface DanalPaymentParams {
    CPID: string;
    TID: string;
    ORDERID: string;
    AMOUNT: number;
    [key: string]: any;
  }
  interface DanalPaymentResponse {
    code: string; // '0000' 성공
    message: string;
    [key: string]: any;
  }
  interface DanalPayments {
    requestPayment: (
      params: DanalPaymentParams,
      callback: (response: DanalPaymentResponse) => void
    ) => void;
  }
  interface Window {
    DanalPayments: DanalPayments;
    IMP?: {
      init: (impCode: string) => void;
      request_pay: (
        params: Record<string, any>,
        callback: (rsp: Record<string, any>) => void
      ) => void;
    };
  }
}
// ────────────────────────────────────────────────────────────────

interface CartItemDetailDto {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface ShoppingCartBodyProps {
  cartItems: CartItemDetailDto[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemDetailDto[]>>;
}

const ShoppingCartBody: React.FC<ShoppingCartBodyProps> = ({ cartItems, setCartItems }) => {
  // 금액 합계
  const totalItemPrice = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingCost = 7000;
  const quantityShippingCost = 3500;
  const totalPayment = totalItemPrice + shippingCost + quantityShippingCost;

  // ────────────────────────────────────────────────────────────────
  // (옵션) 일반결제: 다날 직연동 흐름
  // 백엔드에 POST /api/order/prepare 가 있어야 합니다.
  // ────────────────────────────────────────────────────────────────
  const handleOrderClick = useCallback(async () => {
  if (typeof window === 'undefined') return;

  try {
    // 1) 아임포트 SDK 로드 & init
    await loadIamportScript();
    window.IMP?.init(import.meta.env.VITE_IAMPORT_CODE); // ex) imp78074852

    // 2) 주문번호 생성 (임의)
    const merchantUid = 'order-' + Date.now();
    const token = localStorage.getItem('accessToken');

    // 3) 장바구니 금액으로 "일반결제" 호출 (고객정보는 원하는 값으로 세팅)
    window.IMP?.request_pay(
      {
        pg: 'danal.A010002002',    // 다날 채널 명시
        pay_method: 'phone',       // 휴대폰 일반결제
        merchant_uid: merchantUid,
        name: '장바구니 결제',
        amount: totalPayment,      // 장바구니 총 결제금액
        buyer_email: 'user@example.com',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678',
      },
      async (rsp: any) => {
        if (rsp?.success) {
          // 4) 서버 검증 (이미 만들어 둔 complete 재사용)
          await fetch('http://localhost:8080/api/payments/iamport/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
            body: JSON.stringify({
              impUid: rsp.imp_uid,
              merchantUid,
              amount: totalPayment,
            }),
          });
          alert('일반결제 성공');
        } else {
          alert(`일반결제 실패: ${rsp?.error_msg || '알 수 없는 오류'}`);
        }
      }
    );
  } catch (e: any) {
    console.error(e);
    alert(e?.message || '일반결제 초기화 실패');
  }
}, [totalPayment]);

  // ────────────────────────────────────────────────────────────────
  // 정기결제(다날 휴대폰 빌링) – PortOne(아임포트) SDK 사용
  // ────────────────────────────────────────────────────────────────
  const handleSubscribeClick = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      // 1) SDK 로드 & 초기화 (반드시 .env: VITE_IAMPORT_CODE=imp78074852)
      await loadIamportScript();
      window.IMP?.init(import.meta.env.VITE_IAMPORT_CODE); // ex) imp78074852

      // 2) 준비 API 호출 (customerUid/merchantUid/buyer 수신)
      const token = localStorage.getItem('accessToken');
      const prepRes = await fetch('http://localhost:8080/api/payments/iamport/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
        body: JSON.stringify({ planCode: 'MONTHLY_BASIC', amount: 10000 }), // 고정 요금
      });
      if (!prepRes.ok) throw new Error('정기결제 준비 실패');
      const { customerUid, merchantUid, buyer } = await prepRes.json();

      // 3) 결제창 호출 (다날-휴대폰 정기 채널 명시)
      window.IMP?.request_pay(
        {
          pg: 'danal.A010002002', // ✅ 반드시 명시(테스트 MID)
          pay_method: 'phone',
          merchant_uid: merchantUid,
          name: '정기결제(최초 인증 결제)',
          amount: 10000,          // 이후 매월 동일 금액
          customer_uid: customerUid, // ✅ 필수
          buyer_email: buyer?.email,
          buyer_name:  buyer?.name,
          buyer_tel:   buyer?.tel,
          // m_redirect_url: 'https://your.site/pay/complete' // 모바일 웹이면 권장
        },
        async (rsp: any) => {
          if (rsp?.success) {
            // 4) 서버 검증
            const verify = await fetch('http://localhost:8080/api/payments/iamport/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
              body: JSON.stringify({
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                customerUid,
                amount: 10000,
                planCode: 'MONTHLY_BASIC',
              }),
            });
            if (!verify.ok) throw new Error('결제 검증 실패');
            alert('정기결제 등록(최초 결제) 성공');
          } else {
            alert(`정기결제 등록 실패: ${rsp?.error_msg || '알 수 없는 오류'}`);
          }
        }
      );
    } catch (e: any) {
      console.error(e);
      alert(e?.message || '결제 초기화 실패');
    }
  }, []);

  // 아이템 삭제/수량 변경
  const handleRemoveItem = useCallback((cartItemId: number) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  }, [setCartItems]);

  const handleQuantityChange = useCallback((cartItemId: number, change: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  }, [setCartItems]);

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10">
      {cartItems.length > 0 ? (
        <>
          {/* (b) key 경고 해결: key에 cartItemId-productId 조합 사용 */}
          <div className={styles.cartItemList}>
            {cartItems.map((item) => (
              <div
                key={`${item.cartItemId}-${item.productId}`}
                className={styles.cartItem}
              >
                <img
                  src={`http://localhost:8080${item.imageUrl}`}
                  alt={item.productName}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <span className={styles.productName}>{item.productName}</span>
                  <span className={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(item.cartItemId, -1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className={styles.quantityInput}
                    />
                    <button
                      className={styles.quantityButton}
                      onClick={() => handleQuantityChange(item.cartItemId, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(item.cartItemId)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          {/* 합계 섹션 */}
          <div className={styles.summarySection}>
            <div><span>총 상품 금액:</span><span>{totalItemPrice.toLocaleString()}원</span></div>
            <div><span>즉시 할인 금액:</span><span>- 0원</span></div>
            <div><span>일반 배송비:</span><span>+ {shippingCost.toLocaleString()}원</span></div>
            <div><span>수량별 배송비:</span><span>+ {quantityShippingCost.toLocaleString()}원</span></div>
            <div className={styles.totalPrice}><span>총 결제 금액:</span><span>{totalPayment.toLocaleString()}원</span></div>
          </div>

          {/* 배송 옵션 */}
          <div className={styles.shippingOptions}>
            <h3>배송 방법 변경</h3>
            <label><input type="radio" name="shippingMethod" /> 직배송</label>
            <label><input type="radio" name="shippingMethod" /> 직배송 추가</label>
            <label><input type="radio" name="shippingMethod" defaultChecked /> 택배배송</label>
            <label><input type="radio" name="shippingMethod" /> 바로드림</label>
          </div>

          {/* 액션 버튼 */}
          <div className={styles.actionButtons}>
            <button className={styles.orderButton} onClick={handleOrderClick}>
              주문하기(일반결제)
            </button>
            <button className={styles.continueButton}>계속 쇼핑하기</button>
            <button className={styles.orderButton} onClick={handleSubscribeClick}>
              휴대폰 정기결제(빌링) 등록
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 text-xl py-12">
          장바구니에 담긴 상품이 없습니다.
        </div>
      )}
    </div>
  );
};

export default ShoppingCartBody;
