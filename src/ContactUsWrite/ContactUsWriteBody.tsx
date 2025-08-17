import React, { useState } from 'react';
import styles from '../styles/ContactUsWrite/ContactUsWriteBody.module.css';

// --- API endpoints for the Spring Boot backend ---
const API_BASE_URL = 'http://localhost:8080/api';

// --- Icons (SVG) ---
const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 2a2 2 0 00-2 2v10a4 4 0 004 4h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM6 4a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6a.5.5 0 01-1 0V4.707L8.707 6.293a1 1 0 00-1.414 0L6.293 4.707A.5.5 0 016 4z" clipRule="evenodd" />
  </svg>
);

// --- Loader (Pure CSS) ---
const Spinner = () => (
  <div className={styles.spinnerContainer}>
    <div className={styles.spinner}></div>
  </div>
);

const ContactUsWriteBody: React.FC<{ onNavigate: (page: string) => void, userId: string, userName: string }> = ({ onNavigate, userId, userName }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title,
          content,
          userId,
          userName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create inquiry.');
      }

      setMessage('문의가 성공적으로 등록되었습니다.');
      onNavigate('list');
    } catch (error) {
      console.error('Error adding inquiry:', error);
      setMessage('문의 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>1:1 문의 작성</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              내용
            </label>
            <textarea
              id="content"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
            />
          </div>
          <div className={styles.fileInputGroup}>
            <label className={styles.fileInputLabel}>
              <PaperclipIcon />
              <span>파일 첨부</span>
              <input type="file" className={styles.fileInput} onChange={handleFileChange} />
            </label>
            {file && <span className={styles.fileName}>{file.name}</span>}
          </div>
          {message && (
            <div className={styles.message}>
              {message}
            </div>
          )}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => onNavigate('list')}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading && <Spinner />}
              <span className={loading ? styles.buttonTextLoading : ''}>작성하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUsWriteBody;
