// src/pages/VegetableandFruitDetailFooterPage.tsx

import React from 'react';
import styles from '../styles/VegetableandFruit/VegetableandFruitDetailFooter.module.css';

const VegetableandFruitDetailFooterPage: React.FC = () => {
    return (
        <div className={styles.detailFooter}>
            <h2 className={styles.footerTitle}>상품 정보</h2>
            <div className={styles.footerGrid}>
                <div className={styles.footerItem}>
                    <div className={styles.footerLabel}>배송방법</div>
                    <div className={styles.footerContent}>택배배송</div>
                </div>
                <div className={styles.footerItem}>
                    <div className={styles.footerLabel}>판매단위</div>
                    <div className={styles.footerContent}>1봉</div>
                </div>
                <div className={styles.footerItem}>
                    <div className={styles.footerLabel}>중량/용량</div>
                    <div className={styles.footerContent}>500g</div>
                </div>
                <div className={styles.footerItem}>
                    <div className={styles.footerLabel}>원산지</div>
                    <div className={styles.footerContent}>국내산</div>
                </div>
                <div className={styles.footerItem}>
                    <div className={styles.footerLabel}>포장타입</div>
                    <div className={styles.footerContent}>상온</div>
                </div>
                <div className={styles.footerItem}>
                    <div className={styles.footerLabel}>유통기한</div>
                    <div className={styles.footerContent}>제조일로부터 3일</div>
                </div>
            </div>
        </div>
    );
};

export default VegetableandFruitDetailFooterPage;