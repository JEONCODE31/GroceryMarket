import React from 'react';
import styles from '../../styles/VegetableandFruit/VegetableandFruitBody.module.css';

interface Product {
  id: number;
  name: string;
  image: string; // 예: '/images/carrot.png'
  price: number;
  bestNumber: number;
}

interface VegetableandFruitBodyProps {
  products: Product[];
}

const VegetableandFruitBody: React.FC<VegetableandFruitBodyProps> = ({ products }) => {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productItem}>
          <div className={styles.imageContainer}>
            <img src={`http://localhost:8080${product.image}`} alt={product.name} />
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