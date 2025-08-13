// src/pages/VegetableandFruitDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/VegetableandFruit/VegetableandFruitDetail.module.css';

interface ProductDetail {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  productDescription: string;
}

const VegetableandFruitDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/product/${productId}`);
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
  }, [productId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.imageContainer}>
        <img src={`http://localhost:8080${product.imageUrl}`} alt={product.productName} />
      </div>
      <div className={styles.infoContainer}>
        <h1 className={styles.productName}>{product.productName}</h1>
        <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
        <div className={styles.descriptionSection}>
          <h2>상품 상세 설명</h2>
          <p>{product.productDescription}</p>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.buyButton}>바로 구매</button>
          <button className={styles.cartButton}>장바구니</button>
        </div>
      </div>
    </div>
  );
};

export default VegetableandFruitDetailPage;