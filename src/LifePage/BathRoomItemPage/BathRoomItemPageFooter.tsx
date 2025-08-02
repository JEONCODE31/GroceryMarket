import React from 'react';
import styles from '../../styles/HomePage/MainFooter.module.css';
import { Link } from 'react-router-dom';

const BathRoomItemPageFooter: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      {/* 상단 푸터 섹션 (공지사항, 자주하는 질문, 고객센터, 무통장 입금 안내) */}
      <div className={styles.footerTop}>
        <div className={styles.footerInner}>
          {/* 공지사항 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>공지사항 <Link to="/notice" className={styles.moreLink}>more</Link></h4>
            <ul className={styles.contentList}>
              <li>2022년 사람의 밥 200g 지수</li>
              <li>포스 점단으로 인해 직매정수 등봉 불가능</li>
            </ul>
          </div>

          {/* 자주하는 질문 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>자주하는 질문 <Link to="/faq" className={styles.moreLink}>more</Link></h4>
            <ul className={styles.contentList}>
              <li>읍수읍 공정육은 어디서 구매하나요?</li>
              <li>키드매플샵점드는 어디서나 출력 하나요?</li>
              <li>상품 교환 환불이 가능한가요?</li>
              <li>제품이 파손되서 왔는데 어떻게 하나요?</li>
              <li>직배송 가능 지역이 궁금해요</li>
              <li>아이스박스 팩 추가해야하나요?</li>
            </ul>
          </div>

          {/* 고객센터 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>고객센터</h4>
            <p className={styles.csPhoneNumber}>1566-6519</p>
            <p className={styles.csOperatingHours}>Time: 10am~5pm (점심 12~1pm)</p>
            <p className={styles.csOperatingHours}>토요일/일요일/공휴일 휴무</p>
            <p className={styles.csNote}>토요일 직배송 정상출고 (택배배송 불가)</p>
            <div className={styles.csButtons}>
              <button className={styles.csButton}>직배송 이용가이드</button>
              <button className={styles.csButton}>택배 이용가이드</button>
            </div>
          </div>

          {/* 무통장 입금 안내 */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>무통장 입금 안내</h4>
            <p className={styles.bankName}>NH농협은행</p>
            <p className={styles.accountNumber}>301-0197-5710-11</p>
            <p className={styles.accountHolder}>예금주:(주)에이스상회자재마트</p>
            <button className={styles.depositConfirmButton}>확인입금</button>
          </div>
        </div>
      </div>

      {/* 하단 푸터 섹션 (회사 정보 및 저작권) */}
      <div className={styles.footerBottom}>
        <div className={styles.footerInner}>
          {/* 하단 링크들 */}
          <ul className={styles.bottomLinks}>
            <li><Link to="/company-intro">회사소개</Link></li>
            <li>·</li>
            <li><Link to="/privacy-policy">개인정보취급방침</Link></li>
            <li>·</li>
            <li><Link to="/terms-of-service">이용약관</Link></li>
            <li>·</li>
            <li><Link to="/guide">이용안내</Link></li>
            <li>·</li>
            <li><Link to="/customer-center">고객센터</Link></li>
            <li>·</li>
            <li><Link to="/report-abuse">불편신고신고</Link></li>
          </ul>

          {/* 회사 로고 */}
          <div className={styles.companyLogo}>
            <img src="/path/to/ace_logo_white.png" alt="Ace 에이스상사자재몰" />
            <span className={styles.logoText}>Ace 에이스상사자재몰</span>
          </div>

          {/* 회사 정보 및 저작권 */}
          <div className={styles.companyInfo}>
            <p>사업자등록번호 : 134-86-92772 | 통신판매업신고 제2016-경기안산-0988호 | (주)에이스상회자재마트 | 대표 : 김재원</p>
            <p>경기도 안산시 상록구 광덕대로 24 (이동) 고객센터 : 1566-6519 이메일 : acefoodmall@naver.com</p>
            <p className={styles.copyright}>Copyrightⓒ www.aceamall.asia All Right Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BathRoomItemPageFooter; 