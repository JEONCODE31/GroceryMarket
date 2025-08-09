import React from 'react';
import styles from '../../styles/VegetableandFruit/VegetableandFruitBody.module.css';
import { FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  bestNumber: number;
}

interface VegetableandFruitBodyProps {
  products: Product[];
  // ✨ 오타 수정: onAddtoCart -> onAddToCart
  onAddToCart: (product: Product) => void;
}

// ✨ 수정: onAddToCart prop을 비구조화 할당에 추가합니다.
const VegetableandFruitBody: React.FC<VegetableandFruitBodyProps> = ({ products, onAddToCart }) => {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productItem}>
          <div className={styles.imageContainer}>
            <img src={`http://localhost:8080${product.image}`} alt={product.name} />
            <div className={styles.iconOverlay}>
              {/* onAddToCart가 이제 사용 가능합니다. */}
              <FaShoppingCart onClick={() => onAddToCart(product)} />
              <FaSearch />
              <FaHeart />
            </div>
          </div>
          <div className={styles.productInfo}>
            <p className={styles.bestNumber}>BEST NO.{product.bestNumber}</p>
            <p className={styles.productName}>{product.name}</p>
            <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VegetableandFruitBody;