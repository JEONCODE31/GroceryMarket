import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/VegetableandFruit/VegetableandFruitDetail.module.css';
import VegetableandFruitDetailFooterPage from './VegetableandFruitDetailFooterPage';
import { loadIamportScript } from '../lib/loadIamport'; // 아임포트 스크립트 로더 임포트

// Iamport SDK 타입 선언
declare global {
  interface Window {
    IMP?: {
      init: (impCode: string) => void;
      request_pay: (
        params: Record<string, any>,
        callback: (rsp: Record<string, any>) => void
      ) => void;
    };
  }
}

interface ProductDetail {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  productDescription: string;
}

const VegetableandFruitDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const token = localStorage.getItem('accessToken');
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const pgCode = import.meta.env.VITE_IAMPORT_PG_CODE;

  useEffect(() => {
    const impCode = import.meta.env.VITE_IAMPORT_CODE;

    if (!impCode) {
      console.error("VITE_IAMPORT_CODE is not set in your .env file.");
      return;
    }

    loadIamportScript().then(() => {
      const { IMP } = window;
      if (IMP) {
        const cleanImpCode = impCode.replace(/^imp/, '');
        IMP.init(cleanImpCode);
      } else {
        console.error("Failed to load Iamport script.");
      }
    }).catch(err => {
      console.error("Error loading Iamport script:", err);
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseURL}/product/${productId}`);
        if (!response.ok) {
          throw new Error('상품 정보를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, baseURL]);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      return;
    }

    const cartItem = {
      productId: product?.productId,
      quantity: quantity
    };

    try {
      const response = await fetch(`${baseURL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert('상품이 장바구니에 성공적으로 추가되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`장바구니 추가 실패: ${errorData.message}`);
      }
    } catch (err) {
      console.error("장바구니 추가 중 오류 발생:", err);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!window.IMP) {
      console.error("아임포트 스크립트가 로드되지 않았습니다.");
      return;
    }

    const paymentData = {
      pg: pgCode,
      pay_method: 'card',
      merchant_uid: `order-${new Date().getTime()}`,
      name: product?.productName,
      amount: totalPrice,
      buyer_name: '테스트 사용자',
      buyer_email: 'testuser@test.com',
    };

    window.IMP.request_pay(paymentData, async (rsp) => {
      if (rsp.success) {
        alert(`결제 성공! 결제 금액: ${rsp.paid_amount}원`);

        const orderData = {
          payment: {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
            method: rsp.pay_method,
          },
          items: [{
            productId: product.productId,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
            imageUrl: `${baseURL}${product.imageUrl}`,
          }],
          amount: totalPrice,
        };
        
        try {
          const response = await fetch(`${baseURL}/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          });

          if (response.ok) {
            console.log('주문 데이터가 성공적으로 서버에 전송되었습니다.');
            localStorage.setItem('lastPaidItems', JSON.stringify(orderData));
          } else {
            const errorData = await response.json();
            console.error('서버로 주문 전송 실패:', errorData);
            alert('결제는 완료되었으나, 주문 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.');
          }

        } catch (err) {
          console.error('주문 전송 중 네트워크 오류:', err);
          alert('결제는 완료되었으나, 주문 처리 중 네트워크 오류가 발생했습니다. 관리자에게 문의하세요.');
        }

      } else {
        alert(`결제 실패: ${rsp.error_msg}`);
      }
    });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  const stockOptions = Array.from({ length: product.stockQuantity }, (_, i) => i + 1);

  return (
    <>
      <div className={styles.detailContainer}>
        <div className={styles.imageContainer}>
          <img src={`${baseURL}${product.imageUrl}`} alt={product.productName} />
        </div>
        <div className={styles.infoContainer}>
          <h1 className={styles.productName}>{product.productName}</h1>
          <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
          
          <div className={styles.stockInfo}>
            <span className={styles.stockLabel}>재고 수량: </span>
            <span className={styles.stockQuantity}>
              {product.stockQuantity > 0 ? `${product.stockQuantity.toLocaleString()}개` : '품절'}
            </span>
          </div>

          <div className={styles.quantityControl}>
            <select value={quantity} onChange={handleChangeQuantity} disabled={product.stockQuantity === 0}>
              {stockOptions.map(num => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.purchaseAmount}>
            <span className={styles.amountLabel}>총 구매 금액:</span>
            <span className={styles.amountPrice}>{totalPrice.toLocaleString()}원</span>
          </div>

          <div className={styles.descriptionSection}>
            <h2>상품 상세 설명</h2>
            <p>{product.productDescription}</p>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.buyButton} onClick={handleBuyNow}>바로 구매</button>
            <button className={styles.cartButton} onClick={handleAddToCart}>장바구니</button>
          </div>
        </div>
      </div>

      <VegetableandFruitDetailFooterPage />
    </>
  );
};

export default VegetableandFruitDetailPage;