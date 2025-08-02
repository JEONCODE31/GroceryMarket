import React from 'react';
import styles from '../styles/HomePage/MainHeader.module.css';

const RegisterHeader: React.FC = () => {
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
            <li className={styles.navItem}><a href="/login">로그인</a></li>
            <li className={styles.navItem}><a href="/register">회원가입</a></li>
            <li className={styles.navItem}><a href="/mypage">마이페이지</a></li>
            <li className={styles.navItem}><a href="/cart">장바구니</a></li>
            <li className={styles.navItem}><a href="/orders">주문조회</a></li>
            <li className={styles.navItem}><a href="/customer-support">고객센터</a></li>
          </ul>
          {/* 검색 바 */}
          <div className={styles.searchContainer || styles.searchBar}>
            <input
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

export default RegisterHeader;