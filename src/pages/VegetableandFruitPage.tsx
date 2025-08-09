import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VegetableandFruitBody from '../FoodPage/VegetableandFruitPage/VegetableandFruitBody';
import VegetableandFruitPageFooter from '../FoodPage/VegetableandFruitPage/VegetableandFruitPageFooter';

// ✅ Product 타입 정의
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  bestNumber: number;
}

const VegetableandFruitPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const categoryId = 1;

  // ✅ 장바구니에 상품 추가 + 토큰 확인 + 알림
  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
         'http://localhost:8080/api/cart',
        
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('장바구니에 추가되었습니다.');
      navigate('/cart');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  // ✅ 상품 목록 가져오기
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/products/by-category?categoryId=${categoryId}&page=1&size=12`);
      if (!response.ok) throw new Error('상품 데이터를 불러오는 데 실패했습니다.');

      const data = await response.json();

      setProducts(data.products.map((item: any) => ({
        id: item.productId,
        name: item.productName,
        image: item.imageUrl,
        price: item.price,
        bestNumber: 0,
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

  if (products.length === 0) {
    return (
      <div>
        <div style={{ padding: '20px', textAlign: 'center' }}>등록된 상품이 없습니다.</div>
        <VegetableandFruitPageFooter />
      </div>
    );
  }

  return (
    <div>
      <VegetableandFruitBody products={products} onAddToCart={handleAddToCart} />
      <VegetableandFruitPageFooter />
    </div>
  );
};

export default VegetableandFruitPage;
