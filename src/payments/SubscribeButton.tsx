import React, { useCallback } from 'react';
import { loadIamportScript } from '@/lib/loadIamport';

const SubscribeButton: React.FC = () => {
  const handleSubscribeClick = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      // 1) SDK 로드
      await loadIamportScript();

      // 2) init (환경변수/서버 내려주기 권장)
      window.IMP?.init(import.meta.env.VITE_IAMPORT_CODE || 'impXXXXXXXX');

      // 3) 백엔드에서 customerUid/merchantUid/구매자/PG MID 받기
      const token = localStorage.getItem('accessToken');
      const prepRes = await fetch('http://localhost:8080/api/payments/iamport/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planCode: 'MONTHLY_BASIC', amount: 10000 }),
      });
      if (!prepRes.ok) throw new Error('정기결제 준비 실패');
      const { customerUid, merchantUid, buyer, pgMid } = await prepRes.json();

      // 4) 요청 (다날 채널 명시: pgMid = "A010002002" 내려주면 'danal.A010002002')
      window.IMP?.request_pay(
        {
          pg: pgMid ? `danal.${pgMid}` : 'danal',
          pay_method: 'phone',
          merchant_uid: merchantUid,
          name: '정기결제(최초 인증 결제)',
          amount: 10000,           // 이후 매월 동일 금액
          customer_uid: customerUid,
          buyer_email: buyer.email,
          buyer_name:  buyer.name,
          buyer_tel:   buyer.tel,
          // m_redirect_url: 'https://your.site/pay/complete' // 모바일 웹이면 권장
        },
        async (rsp: any) => {
          if (rsp.success) {
            await fetch('http://localhost:8080/api/payments/iamport/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                customerUid,
                amount: 10000,
                planCode: 'MONTHLY_BASIC'
              }),
            });
            alert('정기결제 등록(최초 결제) 성공');
          } else {
            alert(`정기결제 등록 실패: ${rsp.error_msg || '알 수 없는 오류'}`);
          }
        }
      );
    } catch (e: any) {
      console.error(e);
      alert(e.message || '결제 초기화 실패');
    }
  }, []);

  return (
    <button onClick={handleSubscribeClick}>
      휴대폰 정기결제(빌링) 등록
    </button>
  );
};

export default SubscribeButton;
