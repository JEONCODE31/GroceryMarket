import React, { useEffect, useMemo, useState } from 'react';
import styles from '../styles/MyPageBody.module.css';

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
  status?: '결제완료' | '배송중' | '취소/반품' | string;
  payment?: { impUid?: string; merchantUid?: string; method?: string };
}

const fmtDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const MyPageBody: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  // 기본 필터: 최근 15일
  const today = useMemo(() => new Date(), []);
  const defaultStart = useMemo(() => {
    const t = new Date(); t.setDate(t.getDate() - 15); return t;
  }, []);
  const [start, setStart] = useState<string>(fmtDate(defaultStart));
  const [end, setEnd] = useState<string>(fmtDate(today));
  const [activeRange, setActiveRange] = useState<'15d'|'1m'|'3m'|'6m'>('15d');

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
        // 서버 미구현/실패 시: 결제 직후 저장한 로컬 캐시
        const cached = localStorage.getItem('lastPaidItems');
        if (cached) {
          const parsed = JSON.parse(cached);
          const items: OrderItem[] = parsed.items || [];
          const amount = items.reduce((t: number, i: OrderItem) => t + i.price * i.quantity, 0);
          setOrders([{
            id: 'local-cache',
            createdAt: new Date(parsed.at || Date.now()).toISOString(),
            amount,
            items,
            status: '결제완료',
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

  // 기간 필터
  const filtered = useMemo(() => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime() + (24 * 60 * 60 * 1000 - 1);
    return orders.filter(o => {
      const t = new Date(o.createdAt).getTime();
      return t >= s && t <= e;
    });
  }, [orders, start, end]);

  const handleQuickRange = (type: '15d'|'1m'|'3m'|'6m') => {
    setActiveRange(type);
    const now = new Date();
    const d = new Date();
    if (type === '15d') d.setDate(now.getDate() - 15);
    if (type === '1m')  d.setMonth(now.getMonth() - 1);
    if (type === '3m')  d.setMonth(now.getMonth() - 3);
    if (type === '6m')  d.setMonth(now.getMonth() - 6);
    setStart(fmtDate(d));
    setEnd(fmtDate(now));
  };

  const totals = useMemo(() => {
    const sum = (arr: Order[]) => arr.reduce((t, o) => t + (o.amount || 0), 0);
    return {
      totalOrders: orders.length,
      totalAmount: sum(orders),
      // 상태 데이터가 없으면 0 처리
      inTransit: orders.filter(o => o.status === '배송중').length,
      canceled:  orders.filter(o => (o.status || '').includes('취소')).length,
    };
  }, [orders]);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  if (loading) return <div className={styles.container}>로딩 중…</div>;

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>마이페이지 <span>MY PAGE</span></h1>
        <div className={styles.memberRow}>
          <span className={styles.memberName}>
            {localStorage.getItem('buyerName') || '고객'}님은 [일반회원]입니다.
          </span>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.circleIcon}>🤲</div>
            <div className={styles.statLabel}>적립금</div>
            <div className={styles.statValue}>₩1,000</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.circleIcon}>🏷️</div>
            <div className={styles.statLabel}>쿠폰</div>
            <div className={styles.statValue}>0</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.circleIcon}>💳</div>
            <div className={styles.statLabel}>예치금</div>
            <div className={styles.statValue}>₩0</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.circleIcon}>🧾</div>
            <div className={styles.statLabel}>주문배송조회</div>
            <div className={styles.statValue}>{totals.totalOrders}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.circleIcon}>🚚</div>
            <div className={styles.statLabel}>배송중</div>
            <div className={styles.statValue}>{totals.inTransit}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.circleIcon}>📦</div>
            <div className={styles.statLabel}>취소/교환/반품</div>
            <div className={styles.statValue}>{totals.canceled}</div>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.tabActive}`}>최근구매상품</button>
          <button className={styles.tab}>관심상품</button>
          <button className={styles.tab}>1:1문의확인</button>
          <button className={styles.tab}>상품Q&amp;A</button>
        </div>
      </section>

      {/* 주문배송조회 */}
      <section className={styles.ordersSection}>
        <h2 className={styles.sectionTitle}>주문배송조회</h2>
        <div className={styles.subNote}>[6개월 이전 주문내역확인하기]</div>

        <div className={styles.filters}>
          <div className={styles.pills}>
            <button
              className={`${styles.pill} ${activeRange === '15d' ? styles.pillActive : ''}`}
              onClick={() => handleQuickRange('15d')}
            >
              최근15일
            </button>
            <button
              className={`${styles.pill} ${activeRange === '1m' ? styles.pillActive : ''}`}
              onClick={() => handleQuickRange('1m')}
            >
              최근1개월
            </button>
            <button
              className={`${styles.pill} ${activeRange === '3m' ? styles.pillActive : ''}`}
              onClick={() => handleQuickRange('3m')}
            >
              최근3개월
            </button>
            <button
              className={`${styles.pill} ${activeRange === '6m' ? styles.pillActive : ''}`}
              onClick={() => handleQuickRange('6m')}
            >
              최근6개월
            </button>
          </div>

          <div className={styles.dateInputs}>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} />
            <span className={styles.dateDash}>~</span>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
            <button className={styles.searchBtn}>조회</button>
          </div>

          <div className={styles.hint}>※ 최대 6개월간의 주문내역을 조회할 수 있습니다.</div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>번호</th>
                <th>주문번호</th>
                <th>구매내역</th>
                <th>주문금액</th>
                <th>실 결제금액</th>
                <th>주문일자</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {error || filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>주문내역이 존재하지 않습니다.</td>
                </tr>
              ) : (
                filtered.map((o, idx) => {
                  const first = o.items?.[0];
                  const rest = Math.max(0, (o.items?.length || 0) - 1);
                  return (
                    <tr key={String(o.id)}>
                      <td>{idx + 1}</td>
                      <td className={styles.orderId}>{o.id}</td>
                      <td>
                        <div className={styles.itemsCell}>
                          <div className={styles.itemThumbs}>
                            {o.items?.slice(0, 3).map((it, i) => {
                              const src = it.imageUrl?.startsWith('http')
                                ? it.imageUrl
                                : `${baseURL}${it.imageUrl || ''}`;
                              return (
                                <img key={`${it.productId}-${i}`} src={src} alt={it.productName} />
                              );
                            })}
                            {rest > 2 && <span className={styles.more}>+{rest - 2}</span>}
                          </div>
                          <div className={styles.itemText}>
                            {first ? first.productName : '-'}
                            {rest > 0 && <span className={styles.extra}> 외 {rest}건</span>}
                          </div>
                        </div>
                      </td>
                      <td className={styles.money}>₩{(o.amount || 0).toLocaleString('ko-KR')}</td>
                      <td className={styles.money}>₩{(o.amount || 0).toLocaleString('ko-KR')}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>{o.status || '결제완료'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <ul className={styles.caution}>
          <li>주문상태가 상품준비중 이후부터는 취소가 불가합니다.</li>
          <li>냉장, 냉동상품은 반품시 전량 폐기되므로 교환 및 환불이 되지 않습니다.</li>
          <li>고객님의 잘못된 연락처/주소로 인한 반품은 환불이 되지 않을 수 있습니다.</li>
          <li>배송완료 후 7일이 지난 경우에는 반품 및 교환이 되지 않습니다.</li>
        </ul>
      </section>
    </div>
  );
};

export default MyPageBody;
