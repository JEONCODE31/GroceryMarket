import React from 'react';
import styles from '../styles/CartPage/ShoppingCartBody.module.css';

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
  // 총 상품 금액 계산
  const totalItemPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // 배송비 및 총 결제 금액 계산
  const shippingCost = 7000;
  const quantityShippingCost = 3500;
  const totalPayment = totalItemPrice + shippingCost + quantityShippingCost;

  // 상품 삭제 핸들러
  const handleRemoveItem = (cartItemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (cartItemId: number, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) } // 수량은 최소 1
          : item
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10">
      {cartItems.length > 0 ? (
        <>
          <div className={styles.cartItemList}>
            {cartItems.map(item => (
              <div key={item.cartItemId} className={styles.cartItem}>
                <img
                  src={`http://localhost:8080${item.imageUrl}`}  // 이미지 경로 수정
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
                  <button className={styles.removeButton} onClick={() => handleRemoveItem(item.cartItemId)}>
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          {/* 총 결제 금액 정보 */}
          <div className={styles.summarySection}>
            <div>
              <span>총 상품 금액:</span>
              <span>{totalItemPrice.toLocaleString()}원</span>
            </div>
            <div>
              <span>즉시 할인 금액:</span>
              <span>- 0원</span>
            </div>
            <div>
              <span>일반 배송비:</span>
              <span>+ {shippingCost.toLocaleString()}원</span>
            </div>
            <div>
              <span>수량별 배송비:</span>
              <span>+ {quantityShippingCost.toLocaleString()}원</span>
            </div>
            <div className={styles.totalPrice}>
              <span>총 결제 금액:</span>
              <span>{totalPayment.toLocaleString()}원</span>
            </div>
          </div>

          {/* 배송 방법 변경 및 버튼 */}
          <div className={styles.shippingOptions}>
            <h3>배송 방법 변경</h3>
            <label>
              <input type="radio" name="shippingMethod" />
              직배송
            </label>
            <label>
              <input type="radio" name="shippingMethod" />
              직배송 추가
            </label>
            <label>
              <input type="radio" name="shippingMethod" defaultChecked />
              택배배송
            </label>
            <label>
              <input type="radio" name="shippingMethod" />
              바로드림
            </label>
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.orderButton}>주문하기</button>
            <button className={styles.continueButton}>계속 쇼핑하기</button>
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
