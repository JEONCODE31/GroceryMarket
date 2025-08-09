import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/CartPage/ShoppingCartBody.module.css';



interface CartItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  shippingFee: number;
  packaging: string;
}

const ShoppingCartBody: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    console.log('accessToken:', access);
    if (!access) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    axios.get('/api/cart', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        console.error('장바구니 로드 실패:', err);
      });
  }, []);

  const totalProductPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalShipping = cartItems.reduce((acc, item) => acc + item.shippingFee, 0);
  const totalPayment = totalProductPrice + totalShipping;

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.title}>장바구니</h2>
      <div className={styles.cartHeader}>
        <span>상품명</span>
        <span>가격</span>
        <span>수량</span>
        <span>배송비</span>
        <span>포장박스선택</span>
      </div>

      {cartItems.map(item => (
        <div className={styles.cartItem} key={item.id}>
          <div className={styles.productInfo}>
            <img src={`http://localhost:8080${item.image}`} alt={item.name} className={styles.productImage} />
            <span>{item.name}</span>
          </div>
          <span>{(item.price * item.quantity).toLocaleString()}원</span>
          <div className={styles.quantityBox}>
            <span>{item.quantity}</span>
          </div>
          <span>{item.shippingFee.toLocaleString()}원</span>
          <span>{item.packaging}</span>
        </div>
      ))}

      <div className={styles.summaryBox}>
        <div>
          <p>총 상품금액: {totalProductPrice.toLocaleString()}원</p>
          <p>배송비: {totalShipping.toLocaleString()}원</p>
          <p className={styles.total}>총 결제금액: {totalPayment.toLocaleString()}원</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.orderBtn}>주문하기</button>
          <button className={styles.continueBtn}>계속쇼핑하기</button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartBody;
