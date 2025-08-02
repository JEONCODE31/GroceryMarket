import React from 'react';
import styles from '../../styles/HomePage/MainHeader.module.css';

const RiceandGrainPageHeader: React.FC = () => {
  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerTop}>
        <h1 className={styles.logo}>에이스식자재몰</h1>
      </div>
      <div className={styles.headerBottom}>
        <div className={styles.navContainer}>
          <ul className={styles.navList}>
            <li className={styles.navItem}><a href="/login">로그인</a></li>
            <li className={styles.navItem}><a href="/register">회원가입</a></li>
            <li className={styles.navItem}><a href="/mypage">마이페이지</a></li>
            <li className={styles.navItem}><a href="/cart">장바구니</a></li>
            <li className={styles.navItem}><a href="/orders">주문조회</a></li>
            <li className={styles.navItem}><a href="/customer-support">고객센터</a></li>
          </ul>
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

export default RiceandGrainPageHeader; 