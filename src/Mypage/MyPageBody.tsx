import React, { useEffect, useState } from 'react';

interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
interface Order {
  id: string | number;
  createdAt: string;
  amount: number;
  items: OrderItem[];
  payment?: { impUid?: string; merchantUid?: string; method?: string };
}

const MyPageBody: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem('accessToken') || '';
      const base  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      try {
        const res = await fetch(`${base}/api/orders/me`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (!res.ok) throw new Error('서버 주문 조회 실패');

        const data = await res.json();
        const list: Order[] = Array.isArray(data) ? data : (data.content ?? []);
        setOrders(list);
      } catch {
        const cached = localStorage.getItem('lastPaidItems');
        if (cached) {
          const parsed = JSON.parse(cached);
          const items: OrderItem[] = parsed.items || [];
          const amount = items.reduce((t, i) => t + i.price * i.quantity, 0);
          setOrders([{
            id: 'local-cache',
            createdAt: new Date(parsed.at || Date.now()).toISOString(),
            amount,
            items,
            payment: parsed.payment || {},
          }]);
        } else {
          setError('주문 내역이 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="p-6">로딩 중…</div>;
  if (error)   return <div className="p-6 text-gray-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">나의 주문 내역</h2>
      {orders.length === 0 ? (
        <div className="text-gray-600">주문이 없습니다.</div>
      ) : (
        <ul className="space-y-6">
          {orders.map((o) => (
            <li key={o.id} className="border rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">주문번호: {o.id}</div>
                <div className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                결제: {o.payment?.method ?? '휴대폰결제'} / impUid: {o.payment?.impUid ?? '-'}
              </div>

              <div className="divide-y">
                {o.items.map((it, idx) => (
                  <div key={`${it.productId}-${idx}`} className="py-3 flex items-center gap-4">
                    {it.imageUrl && (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${it.imageUrl}`}
                        className="w-16 h-16 object-cover rounded-md"
                        alt={it.productName}
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{it.productName}</div>
                      <div className="text-sm text-gray-500">
                        수량 {it.quantity.toLocaleString()} · {(it.price * it.quantity).toLocaleString()}원
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right font-semibold mt-3">
                총액 {o.amount.toLocaleString()}원
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPageBody;
