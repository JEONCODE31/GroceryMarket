// src/ShoppingCart/ShoppingCartBody.tsx
import React from 'react';
// styles 폴더의 모듈 CSS 파일을 임포트합니다.
import styles from '../styles/CartPage/ShoppingCartBody.module.css';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface ShoppingCartBodyProps {
  cartItems: CartItem[];
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemoveItem: (id: number) => void;
  // 하단 UI에 필요한 정보들
  subtotal: number;
  shippingFee: number;
  total: number;
}

const ShoppingCartBody: React.FC<ShoppingCartBodyProps> = ({ cartItems, onQuantityChange, onRemoveItem, subtotal, shippingFee, total }) => {
  return (
    <>
      {/* 장바구니 상품 목록 */}
      <div className={styles.cartItemList}>
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <div key={item.id} className={styles.cartItem}>
              {/* 상품 이미지를 렌더링합니다. item.image가 없으면 대체 이미지를 사용합니다. */}
              <img
                src={item.image || `https://placehold.co/80x80/e2e8f0/cbd5e0?text=No+Image`}
                alt={item.name}
                className={styles.itemImage}
                // 이미지가 로드되지 않았을 때 호출됩니다.
                onError={(e) => {
                  console.error(`Error loading image for item: ${item.name}`, e);
                  // 에러 발생 시 대체 이미지를 표시합니다.
                  e.currentTarget.src = `https://placehold.co/80x80/e2e8f0/cbd5e0?text=No+Image`;
                }}
              />
              
              {/* 상품 이름 및 가격 */}
              <div className={styles.itemDetails}>
                <p className={styles.productName}>{item.name}</p>
                <p className={styles.itemPrice}>{item.price.toLocaleString()}원</p>
              </div>

              {/* 수량 조절 및 삭제 버튼 */}
              <div className={styles.itemActions}>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityButton}
                    // 수량 감소 버튼
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  >-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    readOnly
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityButton}
                    // 수량 증가 버튼
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <button
                  className={styles.removeButton}
                  // 상품 삭제 버튼
                  onClick={() => onRemoveItem(item.id)}
                >삭제</button>
              </div>
            </div>
          ))
        ) : (
          // 장바구니가 비어있을 경우 표시될 메시지
          <p style={{ textAlign: 'center', color: '#4a5568' }}>장바구니가 비어있습니다.</p>
        )}
      </div>

      {/* 하단 총액 요약 정보 */}
      <div className={styles.summaryContainer}>
        <div className={styles.summaryRow}>
          <span>총 상품 금액</span>
          {/* subtotal이 undefined일 경우 0을 기본값으로 사용합니다. */}
          <span>{(subtotal ?? 0).toLocaleString()}원</span>
        </div>
        <div className={styles.summaryRow}>
          <span>배송비</span>
          {/* shippingFee가 undefined일 경우 0을 기본값으로 사용합니다. */}
          <span>{(shippingFee ?? 0).toLocaleString()}원</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span>총 결제 금액</span>
          {/* total이 undefined일 경우 0을 기본값으로 사용합니다. */}
          <span>{(total ?? 0).toLocaleString()}원</span>
        </div>
        
        {/* 하단 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <button className={styles.checkoutButton}>주문하기</button>
          <button className={styles.continueButton}>계속 쇼핑하기</button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartBody;