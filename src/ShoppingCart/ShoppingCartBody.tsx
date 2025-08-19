import React, { useCallback, useMemo, useEffect } from 'react';
import styles from '@/styles/CartPage/ShoppingCartBody.module.css';
import { loadIamportScript } from '../lib/loadIamport';

// (선택) 다날 직연동 SDK 타입 - 네 프로젝트에 danal.d.ts가 없다면 여기 둬도 됩니다.
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

interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Props {
  cartItems: CartItem[];
  onQuantityChange: (cartItemId: number, newQuantity: number) => void;
  onRemoveItem: (cartItemId: number) => void;
  subtotal: number;
  shippingFee: number;
  total: number;
  // onOrderClick prop은 아래 handleOrderClick 함수로 대체되므로 필요하지 않습니다.
}

const ShoppingCartBody: React.FC<Props> = ({
  cartItems,
  onQuantityChange,
  onRemoveItem,
  subtotal,
  shippingFee,
  total,
}) => {
  // useEffect를 사용하여 Iamport 스크립트를 동적으로 로드하고 초기화합니다.
  useEffect(() => {
    // 환경 변수에서 가맹점 식별코드 가져오기
    const impCode = import.meta.env.VITE_IAMPORT_CODE;

    // 가맹점 코드가 없으면 에러를 출력하고 함수를 종료합니다.
    if (!impCode) {
      console.error("VITE_IAMPORT_CODE is not set in your .env file.");
      alert('가맹점 코드가 설정되지 않았습니다. 결제 기능을 사용할 수 없습니다.');
      return;
    }

    // 아임포트 스크립트 로드
    loadIamportScript().then(() => {
      // 스크립트 로드 후 IMP 객체가 있는지 확인하고 초기화
      const { IMP } = window;
      if (IMP) {
        IMP.init(impCode);
      } else {
        console.error("Failed to load Iamport script.");
      }
    }).catch(error => {
      console.error("Error loading Iamport script:", error);
    });
  }, []);

  const decQty = useCallback((cartItemId: number, currentQuantity: number) => {
    onQuantityChange(cartItemId, currentQuantity - 1);
  }, [onQuantityChange]);

  const incQty = useCallback((cartItemId: number, currentQuantity: number) => {
    onQuantityChange(cartItemId, currentQuantity + 1);
  }, [onQuantityChange]);

  const setQty = useCallback((cartItemId: number, qty: number) => {
    const parsedQty = Math.max(1, Math.min(99, Number.isFinite(qty) ? Math.floor(qty) : 1));
    onQuantityChange(cartItemId, parsedQty);
  }, [onQuantityChange]);

  const handleRemove = useCallback((cartItemId: number) => {
    onRemoveItem(cartItemId);
  }, [onRemoveItem]);

  const memoizedSubtotal = useMemo(() => subtotal, [subtotal]);
  const memoizedShippingFee = useMemo(() => shippingFee, [shippingFee]);
  const memoizedTotal = useMemo(() => total, [total]);

  // VITE_API_BASE_URL 환경변수를 사용
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  // (옵션) 일반결제: 다날 직연동 흐름
  const handleOrderClick = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      if (!window.IMP) {
        // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
        console.error('결제 라이브러리가 로드되지 않았습니다.');
        return;
      }
      
      const merchantUid = 'order-' + Date.now();
      const token = localStorage.getItem('accessToken');

      window.IMP.request_pay(
        {
          pg: 'danal.A010002002',     // 다날 채널 명시
          pay_method: 'phone',       // 휴대폰 일반결제
          merchant_uid: merchantUid,
          name: '장바구니 결제',
          amount: memoizedTotal,     // 장바구니 총 결제금액
          buyer_email: localStorage.getItem('email') || '',
          buyer_name: localStorage.getItem('buyerName') || '홍길동',
          buyer_tel: '010-1234-5678', // 테스트용 전화번호
        },
        async (rsp: any) => {
          if (rsp?.success) {
            await fetch('http://localhost:8080/api/payments/iamport/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
              body: JSON.stringify({
                impUid: rsp.imp_uid,
                merchantUid,
                amount: memoizedTotal,
              }),
            });
            // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
            console.log('일반결제 성공');
            // 성공 후 장바구니 비우기 및 페이지 이동 등 로직 추가
          } else {
            // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
            console.error(`일반결제 실패: ${rsp?.error_msg || '알 수 없는 오류'}`);
          }
        }
      );
    } catch (e: any) {
      console.error(e);
      // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
      console.error(e?.message || '일반결제 초기화 실패');
    }
  }, [memoizedTotal]);

  // 정기결제(다날 휴대폰 빌링) - PortOne(아임포트) SDK 사용
  const handleSubscribeClick = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      if (!window.IMP) {
        // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
        console.error('결제 라이브러리가 로드되지 않았습니다.');
        return;
      }

      const token = localStorage.getItem('accessToken');
      const prepRes = await fetch('http://localhost:8080/api/payments/iamport/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token || ''}` },
        body: JSON.stringify({ planCode: 'MONTHLY_BASIC', amount: 10000 }),
      });
      if (!prepRes.ok) throw new Error('정기결제 준비 실패');
      const { customerUid, merchantUid, buyer } = await prepRes.json();

      window.IMP.request_pay(
        {
          pg: 'danal.A010002002',
          pay_method: 'phone',
          merchant_uid: merchantUid,
          name: '정기결제(최초 인증 결제)',
          amount: 10000,
          customer_uid: customerUid,
          buyer_email: buyer?.email,
          buyer_name:  buyer?.name,
          buyer_tel:   buyer?.tel,
        },
        async (rsp: any) => {
          if (rsp?.success) {
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
            // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
            console.log('정기결제 등록(최초 결제) 성공');
          } else {
            // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
            console.error(`정기결제 등록 실패: ${rsp?.error_msg || '알 수 없는 오류'}`);
          }
        }
      );
    } catch (e: any) {
      console.error(e);
      // alert 대신 사용자 정의 모달 또는 메시지 박스 사용
      console.error(e?.message || '결제 초기화 실패');
    }
  }, []);


  if (cartItems.length === 0) {
    return <div className={styles.emptyCartMessage}>장바구니에 담긴 상품이 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>장바구니</h2>
      
      <ul className={styles.cartItemList}>
        {cartItems.map((i, index) => {
          const src = i.imageUrl?.startsWith('http')
            ? i.imageUrl
            : `${baseURL}${i.imageUrl || ''}`;
          
          return (
            <li key={i.cartItemId || `${i.productId}-${index}`} className={styles.cartItem}>
              {i.imageUrl && (
                <img
                  src={src}
                  alt={i.productName}
                  className={styles.itemImage}
                />
              )}
              <div className={styles.itemDetails}>
                <div className={styles.productName}>{i.productName}</div>
                <div className={styles.itemPrice}>
                  수량 {i.quantity} · {(i.price * i.quantity).toLocaleString()}원
                </div>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.quantityControl} aria-label="수량 조절">
                  <button
                    className={styles.quantityButton}
                    onClick={() => decQty(i.cartItemId, i.quantity)}
                    type="button"
                  >
                    −
                  </button>
                  <input
                    className={styles.quantityInput}
                    type="number"
                    min={1}
                    max={99}
                    value={i.quantity}
                    onChange={(e) => setQty(i.cartItemId, Number(e.target.value))}
                    onBlur={(e) => setQty(i.cartItemId, Number(e.target.value))}
                    inputMode="numeric"
                  />
                  <button
                    className={styles.quantityButton}
                    onClick={() => incQty(i.cartItemId, i.quantity)}
                    type="button"
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(i.cartItemId)}
                  type="button"
                >
                  삭제
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.summarySection}>
        <div>
          <span>상품금액</span>
          <span>{memoizedSubtotal.toLocaleString()}원</span>
        </div>
        <div>
          <span>배송비</span>
          <span>{memoizedShippingFee.toLocaleString()}원</span>
        </div>
        <div className={styles.totalPrice}>
          <span>결제금액:&nbsp;</span>
          <span>{memoizedTotal.toLocaleString()}원</span>
        </div>
        <div className={styles.actionButtons}>
          <button 
            className={styles.orderButton}
            onClick={handleOrderClick}
          >
            주문하기 (총 {memoizedTotal.toLocaleString()}원)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartBody;