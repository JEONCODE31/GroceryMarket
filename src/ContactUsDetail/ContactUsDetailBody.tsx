import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from '../styles/ContactUsDetail/ContactUsDetailBody.module.css';

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

// --- Interface for Reply ---
interface Reply {
  id: string;
  inquiryId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isUserComment: boolean;
  isReplyToAdmin: boolean;
  parentReplyId?: string;
}

// --- Icons (SVG) ---
const UserCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0010 16a5.979 5.979 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

// --- Loader (Pure CSS) ---
const Spinner = () => (
  <div className={styles.spinnerContainer}>
    <div className={styles.spinner}></div>
  </div>
);

// --- Component: ContactUsDetailBody (Inquiry Detail & Replies) ---
const ContactUsDetailBody: React.FC<{ onNavigate: (page: string) => void, inquiryId: string, userId: string, userName: string }> = ({ onNavigate, inquiryId, userId, userName }) => {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchInquiryAndReplies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');

      const inquiryResponse = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!inquiryResponse.ok) {
        throw new Error('문의 상세 정보를 불러오는 데 실패했습니다.');
      }
      const inquiryData: Inquiry = await inquiryResponse.json();
      setInquiry(inquiryData);

      const repliesResponse = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/replies`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!repliesResponse.ok) {
        throw new Error('답변 목록을 불러오는 데 실패했습니다.');
      }
      const repliesData: Reply[] = await repliesResponse.json();
      setReplies(repliesData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [inquiryId]);

  useEffect(() => {
    fetchInquiryAndReplies();
  }, [fetchInquiryAndReplies]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyContent.trim()) return;

    setReplyLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          inquiryId,
          userId,
          userName,
          content: newReplyContent,
          isUserComment: true,
          isReplyToAdmin: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reply.');
      }

      setNewReplyContent('');
      fetchInquiryAndReplies();
    } catch (err) {
      console.error('Error adding reply:', err);
    } finally {
      setReplyLoading(false);
    }
  };

  const getReplyClass = (reply: Reply) => {
    if (reply.isReplyToAdmin) {
      return styles.replyCardAdmin;
    }
    return styles.replyCardUser;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className={styles.errorText}>
        {error || '문의를 찾을 수 없습니다.'}
        <button
          onClick={() => onNavigate('list')}
          className={styles.backToListButton}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.detailHeader}>
          <h1 className={styles.detailTitle}>
            문의 상세
          </h1>
          <button
            onClick={() => onNavigate('list')}
            className={styles.backButton}
          >
            <ArrowLeftIcon /> 목록으로
          </button>
        </div>

        {/* Inquiry Detail */}
        <div className={styles.inquiryCard}>
          <div className={styles.inquiryHeader}>
            <h2 className={styles.inquiryTitle}>{inquiry.title}</h2>
            <span
              className={`${styles.statusBadge} ${
                inquiry.status === '답변 완료'
                  ? styles.statusCompleted
                  : styles.statusWaiting
              }`}
            >
              {inquiry.status}
            </span>
          </div>
          <div className={styles.inquiryMeta}>
            <UserCircleIcon />
            <span>{inquiry.userName}</span>
            <span className={styles.metaDate}>
              {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
            </span>
          </div>
          <div className={styles.inquiryContent}>
            {inquiry.content}
          </div>
        </div>

        {/* Reply Section */}
        <div className={styles.replySection}>
          <h3 className={styles.replyTitle}>댓글</h3>
          <AnimatePresence>
            {replies.map((reply) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`${styles.replyCard} ${getReplyClass(reply)}`}
              >
                <div className={styles.replyMeta}>
                  <div className={styles.replyUserName}>
                    <UserCircleIcon />
                    <span>{reply.userName}</span>
                    {reply.isReplyToAdmin && (
                      <span className={styles.adminBadge}>
                        (관리자)
                      </span>
                    )}
                  </div>
                  <div className={styles.replyDate}>
                    {new Date(reply.createdAt).toLocaleString('ko-KR')}
                  </div>
                </div>
                <p className={styles.replyContent}>
                  {reply.content}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reply Input */}
        <form onSubmit={handleReplySubmit} className={styles.replyInputForm}>
          <textarea
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            rows={4}
            placeholder="댓글을 입력해 주세요..."
            className={styles.replyInput}
          />
          <div className={styles.replyButtonContainer}>
            <button
              type="submit"
              disabled={replyLoading}
              className={styles.replyButton}
            >
              {replyLoading && <Spinner />}
              <span className={replyLoading ? styles.buttonTextLoading : ''}>댓글 작성</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsDetailBody;
