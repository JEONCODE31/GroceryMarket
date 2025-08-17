// src/pages/VegetableandFruitDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/VegetableandFruit/VegetableandFruitDetail.module.css';
import VegetableandFruitDetailFooterPage from './VegetableandFruitDetailFooterPage';

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

    useEffect(() => {
        if (product) {
            setTotalPrice(product.price * quantity);
        }
    }, [quantity, product]);

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuantity(parseInt(e.target.value, 10));
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
        // ✨ 푸터 컴포넌트를 이 div 바깥에 렌더링해야 합니다.
        <>
            <div className={styles.detailContainer}>
                <div className={styles.imageContainer}>
                    <img src={`http://localhost:8080${product.imageUrl}`} alt={product.productName} />
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
                        <button className={styles.buyButton}>바로 구매</button>
                        <button className={styles.cartButton}>장바구니</button>
                    </div>
                </div>
            </div>

            {/* ✨ 푸터 컴포넌트가 이제 detailContainer 바깥, 즉 페이지 하단에 위치합니다. */}
            <VegetableandFruitDetailFooterPage />
        </>
    );
};

export default VegetableandFruitDetailPage;