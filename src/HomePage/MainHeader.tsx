import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HomePage/MainHeader.module.css';

// MainHeader 컴포넌트의 props 타입을 정의합니다.
interface MainHeaderProps {
  isLoggedIn: boolean;
  username: string | null;
  handleLogout: () => void;
  isAdmin: boolean; // ✨ isAdmin prop 추가
}

const MainHeader: React.FC<MainHeaderProps> = ({ isLoggedIn, username, handleLogout, isAdmin }) => {
  const [isInput, setInput] = useState<string>(''); // 입력 값 저장을 위한 상태

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    console.log("현재 검색어:", newValue);
  };

  return (
    <header className={styles.mainHeader}>
      {/* 상단 섹션: 로고 영역 */}
      <div className={styles.headerTop}>
        <h1 className={styles.logo}>에이스식자재몰</h1>
      </div>

      {/* 하단 섹션: 네비게이션 및 검색 바 */}
      <div className={styles.headerBottom}>
        <div className={styles.navContainer}>
          {/* 네비게이션 링크 */}
          <ul className={styles.navList}>
            {isLoggedIn ? (
              // 로그인 상태일 때
              <>
                <li className={styles.navItem}>
                  <span className={styles.navText}>환영합니다, {username}님!</span>
                </li>
                <li className={styles.navItem}>
                  <button onClick={handleLogout} className={styles.navButton}>로그아웃</button>
                </li>
                {/* ✨ isAdmin이 true일 때만 상품등록 버튼 표시 */}
                {isAdmin && (
                  <li className={styles.navItem}><Link to="/ProductRegister">상품등록</Link></li>
                )}
                {/* ✨ isAdmin이 true일 때만 관리자페이지 버튼 표시 */}
                {isAdmin && (
                  <li className={styles.navItem}><Link to="/Admin">관리자페이지</Link></li>
                )}
              </>
            ) : (
              // 로그아웃 상태일 때
              <>
                <li className={styles.navItem}><Link to="/login">로그인</Link></li>
                <li className={styles.navItem}><Link to="/register">회원가입</Link></li>
              </>
            )}
            <li className={styles.navItem}><Link to="/mypage">마이페이지</Link></li>
            <li className={styles.navItem}><Link to="/cart">장바구니</Link></li>
            <li className={styles.navItem}><Link to="/customer-service">고객센터</Link></li>
            <li className={styles.navItem}><Link to="/contactus">문의하기</Link></li>
          </ul>

          {/* 검색 바 */}
          <div className={styles.searchContainer}>
            <input
              onChange={inputHandler}
              value={isInput}
              type="text"
              placeholder="검색어를 입력하세요"
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;