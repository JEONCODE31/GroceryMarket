// src/pages/VegetableandFruitPage.tsx

import React, { useState, useEffect } from 'react';
import VegetableandFruitBody from '../FoodPage/VegetableandFruitPage/VegetableandFruitBody';
import VegetableandFruitPageFooter from '../FoodPage/VegetableandFruitPage/VegetableandFruitPageFooter';

// VegetableandFruitBody.tsx가 기대하는 Product 인터페이스
interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    bestNumber: number;
}

function VegetableandFruitPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const categoryId = 1;

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products/by-category?categoryId=${categoryId}&page=1&size=12`);
            if (!response.ok) {
                throw new Error('상품 데이터를 불러오는 데 실패했습니다.');
            }
            const data = await response.json();
            
            // 백엔드 필드명을 VegetableandFruitBody 컴포넌트가 기대하는 필드명으로 변환
            setProducts(data.products.map((item: any) => ({
                id: item.productId,
                name: item.productName,
                image: item.imageUrl,
                price: item.price,
                bestNumber: 0 // 백엔드에 필드가 없으므로 임시로 0을 할당
            })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    // 로딩 중이거나 오류 발생 시 메시지를 표시하고 푸터를 렌더링
    if (loading) {
        return (
            <div>
                <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
                <VegetableandFruitPageFooter />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div style={{ padding: '20px', textAlign: 'center' }}>오류: {error}</div>
                <VegetableandFruitPageFooter />
            </div>
        );
    }

    // 상품 목록이 비어 있을 때를 위한 조건부 렌더링
    if (!loading && products.length === 0) {
        return (
            <div>
                <div style={{ padding: '20px', textAlign: 'center' }}>등록된 상품이 없습니다.</div>
                <VegetableandFruitPageFooter />
            </div>
        );
    }

    return (
        <div>
            {/* 헤더는 App.tsx에서 전역적으로 렌더링되므로 여기서는 제거합니다. */}
            <VegetableandFruitBody products={products} />
            <VegetableandFruitPageFooter />
        </div>
    );
}

export default VegetableandFruitPage;