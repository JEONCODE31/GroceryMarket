import React, { useState } from 'react';
import api from '../util/api';
import axios from 'axios';
import styles from '../styles/ProductRegister/ProductRegister.module.css';

interface ProductRegisterBodyProps {
   onRegisterSuccess?: () => void;
}

const ProductRegisterBody: React.FC<ProductRegisterBodyProps> = () => {
  const [productData, setProductData] = useState({
    productName: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    productDescription: '',
    productImageUrl: '',
  });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setProductImageFile(null);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('로그인이 필요합니다.');
        alert('로그인이 필요합니다.');
        return;
      }

      const formData = new FormData();
      const { productImageUrl, ...productWithoutImage } = productData; // 이미지 URL 제거

      formData.append(
        'product',
        new Blob([JSON.stringify(productWithoutImage)], { type: 'application/json' })
      );

      if (productImageFile) {
        formData.append('imageFile', productImageFile);
      }

      const response = await api.post('/productregister', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('상품 등록 성공:', response.data);
      alert('상품 등록/업데이트가 성공적으로 완료되었습니다.');

      setProductData({
        productName: '',
        categoryId: '',
        price: '',
        stockQuantity: '',
        productDescription: '',
        productImageUrl: '',
      });
      setProductImageFile(null);
      setImagePreview('');
    } catch (err: any) {
      console.error('상품 등록 실패:', err);
      if (axios.isAxiosError(err) && err.response) {
        const msg = err.response.status === 403
          ? '권한이 없습니다. 관리자로 로그인해주세요.'
          : err.response.status === 401
          ? '로그인이 만료되었습니다. 다시 로그인해주세요.'
          : `상품 등록 실패: ${err.response.data || err.message}`;
        setError(msg);
        alert(`오류: ${msg}`);
      } else {
        setError(`상품 등록 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
        alert(`오류: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.productRegisterContainer}>
      <h2 className={styles.title}>상품 등록</h2>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.formGroup}>
          <label htmlFor="productName" className={styles.label}>제품명</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={productData.productName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="categoryId" className={styles.label}>카테고리</label>
          <select
            id="categoryId"
            name="categoryId"
            value={productData.categoryId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">카테고리 선택</option>
            <option value="1">야채/과일</option>
            <option value="2">쌀/잡곡/견과</option>
            <option value="3">축산/계란류</option>
            <option value="4">커피/생수/음료</option>
            <option value="5">소스/양념</option>
            <option value="6">장류/조미료</option>
            <option value="7">면/가공식품</option>
            <option value="8">스낵/안주류</option>
            <option value="9">반찬류</option>
            <option value="10">캔/통조림</option>
            <option value="11">냉장/냉동/간편식</option>
            <option value="12">수산/해산/건어물</option>
            <option value="13">일반생활용품</option>
            <option value="14">주방용품</option>
            <option value="15">욕실용품</option>
            <option value="16">일회용품/포장용품</option>
            <option value="17">야외/계절용품</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>가격 (원)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="stockQuantity" className={styles.label}>재고 수량</label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            value={productData.stockQuantity}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="productDescription" className={styles.label}>상품 설명</label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={productData.productDescription}
            onChange={handleChange}
            className={styles.textarea}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="productImage" className={styles.label}>상품 이미지</label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={handleFileChange}
            className={styles.fileInput}
            accept="image/*"
          />
          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="상품 이미지 미리보기" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? '등록 중...' : '상품 등록'}
        </button>
      </form>
    </div>
  );
};

export default ProductRegisterBody;
