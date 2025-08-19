import React, { useCallback } from 'react';
import { loadIamportScript } from '@/lib/loadIamport';

declare global { interface Window { IMP?: any } }

const SubscribeButton: React.FC = () => {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const handleSubscribeClick = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      // 1) SDK 로드 & init
      await loadIamportScript();
      window.IMP?.init(import.meta.env.VITE_IAMPORT_CODE || 'impXXXXXXXX');

      // 2) 서버에서 사전 정보 준비 (고객/주문 식별자, 구매자 정보 등)
      const token = localStorage.getItem('accessToken') || '';
      const prepRes = await fetch(`${base}/api/payments/iamport/prepare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planCode: 'MONTHLY_BASIC', amount: 10000 }),
      });
      if (!prepRes.ok) throw new Error('정기결제 준비 실패');
      const { customerUid, merchantUid, buyer, pgMid } = await prepRes.json();

      // 3) 결제창 호출
      window.IMP?.request_pay(
        {
          pg: pgMid ? `danal.${pgMid}` : 'danal',
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
          if (!rsp?.success) {
            alert(`정기결제 등록 실패: ${rsp?.error_msg || '알 수 없는 오류'}`);
            return;
          }

          // 4) 서버 검증
          await fetch(`${base}/api/payments/iamport/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              customerUid,
              amount: 10000,
              planCode: 'MONTHLY_BASIC',
            }),
          });

          // 5) (권장) 주문 생성 — 구독 상품 메타가 있다면 items에 넣어주세요
          const items = JSON.parse(localStorage.getItem('cartItems') || '[]'); // 없으면 빈 배열
          try {
            await fetch(`${base}/api/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                amount: 10000,
                method: 'danal.phone.subscription',
                items, // 구독형이면 빈 배열이어도 OK
              }),
            });
          } catch (e) {
            console.warn('주문 생성 실패(캐시로 대체):', e);
          }

          // 6) 로컬 캐시 → MyPage 즉시 표시
          localStorage.setItem('lastPaidItems', JSON.stringify({
            at: Date.now(),
            payment: { impUid: rsp.imp_uid, merchantUid: rsp.merchant_uid, method: 'danal.phone.subscription' },
            items,
          }));

          // 7) (선택) 장바구니 비우기
          if (items.length) localStorage.removeItem('cartItems');

          // 8) 마이페이지로 이동
          window.location.href = '/mypage';
        }
      );
    } catch (e: any) {
      console.error(e);
      alert(e?.message || '결제 초기화 실패');
    }
  }, [base]);

  return (
    <button onClick={handleSubscribeClick}>
      휴대폰 정기결제(빌링) 등록
    </button>
  );
};

export default SubscribeButton;
