import React from 'react';
import styles from '../../styles/VegetableandFruit/VegetableandFruitBody.module.css';
import { FaShoppingCart, FaSearch, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  bestNumber: number;
}

interface VegetableandFruitBodyProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const VegetableandFruitBody: React.FC<VegetableandFruitBodyProps> = ({ products, onAddToCart }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleProductClick = (productId: number) => {
    navigate(`/vegetables-and-fruits/${productId}`);
  };

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productItem}>
          {/* onClick 이벤트 핸들러 추가 */}
          <div className={styles.imageContainer} onClick={() => handleProductClick(product.id)}>
            <img src={`http://localhost:8080${product.image}`} alt={product.name} />
            <div className={styles.iconOverlay}>
              <FaShoppingCart onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} />
              <FaSearch onClick={(e) => e.stopPropagation()} />
              <FaHeart onClick={(e) => e.stopPropagation()} />
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