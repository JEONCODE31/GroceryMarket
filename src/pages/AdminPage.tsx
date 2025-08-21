import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/AdminPage.module.css';

// DTO(Data Transfer Object) 정의
interface Product {
    productId: number;
    productName: string;
    stockQuantity: number;
}

interface User {
    userId: number;
    userName: string;
    email: string;
}

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [newStockValues, setNewStockValues] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // ⭐️ 토큰을 로컬 스토리지에서 가져와 API 요청 헤더에 추가
                const token = localStorage.getItem('accessToken');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                const response = await axios.get('http://localhost:8080/api/admin/dashboard', { headers });
                const data: { products: Product[], users: User[] } = response.data;
                setProducts(data.products);
                setUsers(data.users);

                const initialStockValues: { [key: number]: number } = {};
                data.products.forEach(p => initialStockValues[p.productId] = p.stockQuantity);
                setNewStockValues(initialStockValues);
            } catch (err) {
                setError('대시보드 데이터를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleStockUpdate = async (productId: number) => {
        const newStock = newStockValues[productId];
        if (newStock === undefined || newStock < 0) {
            alert('유효한 재고 수량을 입력해주세요.');
            return;
        }

        // ⭐️ 토큰을 로컬 스토리지에서 가져와 API 요청 헤더에 추가
        const token = localStorage.getItem('accessToken');
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            // ⭐️ axios.put 요청에 headers 객체 추가
            await axios.put(`http://localhost:8080/api/admin/products/${productId}/stock`, null, { 
                params: { stockQuantity: newStock },
                headers: headers // 수정된 부분
            });
            setProducts(products.map(p => p.productId === productId ? { ...p, stockQuantity: newStock } : p));
            alert('재고가 성공적으로 업데이트되었습니다.');
        } catch (err) {
            alert('재고 업데이트에 실패했습니다.');
        }
    };

    if (loading) return <div className={styles.loading}>로딩 중...</div>;
    if (error) return <div className={styles.error}>에러: {error}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>어드민 페이지</h2>
            <hr className={styles.divider} />
            <h3 className={styles.subHeading}>회원 목록</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>회원명</th>
                        <th>이메일</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr className={styles.divider} />

            <h3 className={styles.subHeading}>상품 재고 관리</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>상품명</th>
                        <th>현재 재고</th>
                        <th>새 재고</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productName}</td>
                            <td>{product.stockQuantity}</td>
                            <td>
                                <input
                                    type="number"
                                    className={styles.inputField}
                                    value={newStockValues[product.productId] || ''}
                                    onChange={(e) => {
                                        setNewStockValues({
                                            ...newStockValues,
                                            [product.productId]: parseInt(e.target.value)
                                        });
                                    }}
                                />
                            </td>
                            <td>
                                <button
                                    className={styles.updateButton}
                                    onClick={() => handleStockUpdate(product.productId)}
                                >
                                    업데이트
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;