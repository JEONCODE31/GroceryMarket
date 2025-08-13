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
  detailImageUrls?: string[]; // 상세 이미지 URL 배열 (선택 사항)
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
        <div className={styles.mainImage}>
          <img src={`http://localhost:8080${product.imageUrl}`} alt={product.productName} />
        </div>
        {product.detailImageUrls && product.detailImageUrls.length > 0 && (
          <div className={styles.thumbnailImages}>
            {product.detailImageUrls.map((url, index) => (
              <img key={index} src={`http://localhost:8080${url}`} alt={`${product.productName} 상세 이미지 ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.infoContainer}>
        <h1 className={styles.productName}>{product.productName}</h1>
        <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
        <div className={styles.detailInfo}>
          {/* 이미지와 같이 표시될 상세 정보 */}
          {/* 예: 상품 코드, 적립금, 박스당 수량 등 */}
        </div>
        <div className={styles.purchaseOptions}>
          {/* 구매 수량 선택, 할인 정보 등 */}
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.buyButton}>바로 구매</button>
          <button className={styles.cartButton}>장바구니</button>
          <button className={styles.wishlistButton}>관심상품</button>
        </div>
        <div className={styles.descriptionSection}>
          <h2>상품 상세 설명</h2>
          <p>{product.productDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default VegetableandFruitDetailPage;