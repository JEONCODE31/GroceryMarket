import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from '../styles/ContactUs/ContactUsBody.module.css';

// --- API endpoints for the Spring Boot backend ---
const API_BASE_URL = 'http://localhost:8080/api';

// --- Interface for Inquiry ---
interface Inquiry {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  status: '답변 대기' | '답변 완료';
  fileUrl?: string;
  fileName?: string;
}

// --- Loader (Pure CSS) ---
const Spinner = () => (
  <div className={styles.spinnerContainer}>
    <div className={styles.spinner}></div>
  </div>
);

// --- Component: ContactUsBody (Inquiry List) ---
const ContactUsBody: React.FC<{ onNavigate: (page: string, props?: any) => void, userId: string }> = ({ onNavigate, userId }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_BASE_URL}/inquiries?userId=${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );
      if (!response.ok) {
        throw new Error('문의 목록을 불러오는 데 실패했습니다.');
      }
      const data: Inquiry[] = await response.json();
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('문의 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorText}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>1:1 문의하기</h1>
        <button
          onClick={() => onNavigate('write')}
          className={styles.writeButton}
        >
          1:1 문의하기
        </button>
      </div>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>제목</th>
              <th className={`${styles.th} ${styles.thHiddenMd}`}>작성자</th>
              <th className={`${styles.th} ${styles.thHiddenMd}`}>작성일</th>
              <th className={styles.th}>상태</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <AnimatePresence>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <motion.tr
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.tr}
                    onClick={() => onNavigate('detail', { inquiryId: inquiry.id })}
                  >
                    <td className={styles.td}>
                      <div className={styles.tdText}>
                        {inquiry.title}
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdHiddenMd}`}>
                      <div className={styles.tdText}>
                        {inquiry.userName}
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdHiddenMd}`}>
                      {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.statusBadge} ${
                          inquiry.status === '답변 완료'
                            ? styles.statusCompleted
                            : styles.statusWaiting
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.noData}>
                    문의 내역이 없습니다.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className={styles.infoText}>
        <p>
          문의 관련 자세한 사항은 상단 메뉴의 '1:1 문의하기' 버튼을 눌러 작성해 주세요.
        </p>
      </div>
      <div className={styles.userIdSection}>
        <p className={styles.userIdTitle}>현재 로그인된 유저 ID:</p>
        <p className={styles.userIdValue}>{userId}</p>
      </div>
    </div>
  );
};

export default ContactUsBody;
