// src/HomePage/MainBody.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ useNavigate 훅 임포트
import styles from '../styles/HomePage/MainBody.module.css';

// 로컬 이미지 경로 (src/assets 폴더에 이미지가 있다고 가정)
import 식자재마트로고 from '../assets/grocery_logo.jpg';
import bestProduct1 from '../assets/best_product1.jpg'; // 버팔로윙 이미지
import bestProduct2 from '../assets/best_product2.jpg'; // 치킨데리야끼 볶음밥 이미지
import bestProduct3 from '../assets/best_product3.jpg'; // 모짜렐라치즈 이미지
import bestProduct4 from '../assets/best_product4.jpg'; // 그린냉면육수 이미지

// 추천 상품 이미지들
import koreanFoodImg from '../assets/korean_food.jpg';
import chineseFoodImg from '../assets/chinese_food.jpg';
import japaneseFoodImg from '../assets/japanese_food.jpg';
import westernFoodImg from '../assets/western_food.jpg';
import snackFoodImg from '../assets/snack_food.jpg';
import pubFoodImg from '../assets/pub_food.jpg';

// 중간 섹션 이미지들
import bannerCookingImage from '../assets/banner_cooking.jpg';
import shippingCalendarImage from '../assets/shipping_calendar.jpg';
import gridImage1 from '../assets/grid_image1.jpg';
import gridImage2 from '../assets/grid_image2.jpg';
import gridImage3 from '../assets/grid_image3.jpg';
import gridImage4 from '../assets/grid_image4.jpg';

// MainBody 컴포넌트의 props 타입을 정의합니다.
interface MainBodyProps {
    isLoggedIn: boolean;
    username: string | null;
}

const MainBody: React.FC<MainBodyProps> = ({ isLoggedIn, username }) => {
    // ✨ useNavigate 훅을 사용하여 페이지 이동 함수를 초기화합니다.
    const navigate = useNavigate();
    
    // 장바구니 사이드바의 열림/닫힘 상태 관리
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen);
    };

    // ✨ 카테고리 클릭 핸들러: 특정 경로로 페이지를 이동시킵니다.
    const handleCategoryClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className={styles.mainBodyContainer}>
            <aside className={styles.leftSidebar}>
                {/* FOOD 카테고리 섹션 */}
                <div className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>
                        FOOD
                        <span className={styles.menuIndicator}>☰</span>
                    </h2>
                    <ul className={styles.categoryList}>
                        {/* ✨ 야채/과일 카테고리 클릭 시 페이지 이동 */}
                        <li 
                            className={styles.categoryItem}
                            onClick={() => handleCategoryClick('/vegetables-and-fruits')}
                        >
                            야채/과일 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            쌀/잡곡/견과 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            축산/계란류 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            커피/생수/음료 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            소스/양념 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            장류/조미료 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            면/가공식품 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            스낵/안주류 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            반찬류 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            캔/통조림 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            냉장/냉동/간편식 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            수산/해산/건어물 <span className={styles.arrow}>&gt;</span>
                        </li>
                    </ul>
                </div>

                {/* 식자재마트 로고 추가 - 카테고리 섹션 사이에 배치 */}
                <div className={styles.logoContainer}>
                    {식자재마트로고 ? (
                        <img src={식자재마트로고} alt="에이스식자재 로고" className={styles.sidebarLogo} />
                    ) : (
                        <div className={styles.logoPlaceholder}>로고 이미지</div>
                    )}
                </div>

                {/* LIFE 카테고리 섹션 */}
                <div className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>
                        LIFE
                        <span className={styles.menuIndicator}>☰</span>
                    </h2>
                    <ul className={styles.categoryList}>
                        <li className={styles.categoryItem}>
                            일반생활용품 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            주방용품 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            욕실용품 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            일회용품/포장용품 <span className={styles.arrow}>&gt;</span>
                        </li>
                        <li className={styles.categoryItem}>
                            야외/계절용품 <span className={styles.arrow}>&gt;</span>
                        </li>
                    </ul>
                </div>

                {/* 고객센터 섹션 */}
                <div className={styles.customerCenter}>
                    <h3 className={styles.customerCenterTitle}>CUSTOMER CENTER</h3>
                    <p className={styles.customerCenterSubTitle}>고객만족센터</p>
                    <p className={styles.phoneNumber}>1566-6519</p>
                    <p className={styles.operatingHours}>10am~5pm (점심 12~1pm)</p>
                    <p className={styles.operatingHours}>토,일요일/민속명절 휴무</p>
                </div>
            </aside>

            <section className={styles.mainContent}>
                {/* ✨ 로그인 상태에 따른 환영/안내 메시지 섹션 추가 */}
                {isLoggedIn ? (
                    <div className={styles.welcomeMessageBox}>
                        <p className={styles.welcomeText}>환영합니다, {username}님!</p>
                        <p className={styles.welcomeSubText}>오늘도 즐거운 쇼핑 되세요.</p>
                    </div>
                ) : (
                    <div className={styles.loginPromptBox}>
                        <p className={styles.loginPromptText}>로그인이 필요합니다.</p>
                        <p className={styles.loginPromptSubText}>다양한 혜택을 위해 로그인해주세요.</p>
                    </div>
                )}

                {/* 나의 장바구니 버튼 */}
                <button
                    className={styles.myCartButton}
                    onClick={handleCartToggle}
                >
                    <span className={styles.cartImg} role="img" aria-label="cart">🛒</span>
                    나의 장바구니
                </button>
                {/* 메인 배너 */}
                <div className={styles.bannerAndHours}>
                    <div className={styles.mainBanner}>
                        <div className={styles.bannerText}>
                            <p className={styles.subCatchphrase}>반찬 준비 손쉽게 끝</p>
                            <p className={styles.mainCatchphrase}>10분이면 뚝딱!</p>
                            <p className={styles.mainCatchphrase}>
                                <span style={{ color: '#e67e22' }}>맛있는 기본반찬</span>
                            </p>
                            <p className={styles.mainCatchphrase}>
                                <span style={{ color: '#e67e22' }}>반조리 푸드</span>
                            </p>
                            <p className={styles.tapTapTap}>
                                뚝딱뚝딱<span style={{ fontSize: '36px' }}>7</span>
                            </p>
                            <p className={styles.instantFoodDescription}>싱글족은 가성비와 한끼뚝딱! 맛별이 식당에선 셀프요리 뚝딱!</p>
                        </div>
                        {/* 배너 이미지 (옵션) */}
                        {/* <img src={mainBannerImage} alt="메인 배너" className={styles.mainBannerImage} /> */}
                    </div>
                    <div className={styles.openingHoursBox}>
                        <h3 className={styles.openingHoursTitle}>운영시간 안내</h3>
                        <ul className={styles.openingHoursList}>
                            <li><span className={styles.dayLabel}>평일</span> <span className={styles.timeLabel}>06:00 ~ 21:00</span></li>
                            <li><span className={styles.dayLabel}>주말</span> <span className={styles.timeLabel}>07:00 ~ 18:00</span></li>
                            <li><span className={styles.dayLabel}>휴무</span> <span className={styles.timeLabel}>설날, 공휴일</span></li>
                        </ul>
                    </div>
                </div>

                {/* 반조리 푸드 섹션 */}
                <div className={styles.instantFoodSection}>
                    <div className={styles.instantFoodText}>
                        <p className={styles.instantFoodTime}>10분이면 뚝딱!</p>
                        <h2 className={styles.instantFoodTitle}>반조리 푸드</h2>
                        <p className={styles.instantFoodSubtitle}>INSTANT FOOD</p>
                        <p className={styles.instantFoodDescription}>싱글족은 가성비와 한끼뚝딱! 맛별이 식당에선 셀프요리 뚝딱!</p>
                    </div>
                    <div className={styles.instantFoodImagePlaceholder}>
                        {bannerCookingImage ? (
                            <img src={bannerCookingImage} alt="반조리 푸드 이미지" className={styles.cookingImage} />
                        ) : (
                            <div className={styles.noImageText}>이미지 없음</div>
                        )}
                    </div>
                </div>

                {/* 택배 주말/공휴일 배너 섹션 */}
                <div className={styles.shippingBanner}>
                    <p className={styles.shippingText}>택배 주말 · 공휴일</p>
                    <p className={styles.shippingText}>정상배송 개시!</p>
                    <div className={styles.shippingImagePlaceholder}>
                        {shippingCalendarImage ? (
                            <img src={shippingCalendarImage} alt="달력 이미지" className={styles.calendarImage} />
                        ) : (
                            <div className={styles.noImageText}>달력 이미지</div>
                        )}
                    </div>
                </div>

                {/* 이미지 업로드 영역 (바디 중간 빈 부분) */}
                <div className={styles.imageGrid}>
                    <div className={styles.imagePlaceholder}>
                        {gridImage1 ? (
                            <img src={gridImage1} alt="그리드 이미지 1" />
                        ) : (
                            <div className={styles.noImageText}>이미지 업로드</div>
                        )}
                    </div>
                    <div className={styles.imagePlaceholder}>
                        {gridImage2 ? (
                            <img src={gridImage2} alt="그리드 이미지 2" />
                        ) : (
                            <div className={styles.noImageText}>이미지 업로드</div>
                        )}
                    </div>
                    <div className={styles.imagePlaceholder}>
                        {gridImage3 ? (
                            <img src={gridImage3} alt="그리드 이미지 3" />
                        ) : (
                            <div className={styles.noImageText}>이미지 업로드</div>
                        )}
                    </div>
                    <div className={styles.imagePlaceholder}>
                        {gridImage4 ? (
                            <img src={gridImage4} alt="그리드 이미지 4" />
                        ) : (
                            <div className={styles.noImageText}>이미지 업로드</div>
                        )}
                    </div>
                </div>

                {/* 추천 상품 섹션 */}
                <div className={styles.recommendedProducts}>
                    <h3 className={styles.recommendedProductsTitle}>추천 상품</h3>

                    {/* 한식 */}
                    <div className={styles.productCategory}>
                        <h4 className={styles.categoryHeader}>한식</h4>
                        <p className={styles.productCategorySubHeader}>KOREAN FOOD</p>
                        <div className={styles.productItem}>
                            {koreanFoodImg ? (
                                <img src={koreanFoodImg} alt="한식" className={styles.productImage} />
                            ) : (
                                <div className={styles.noImageText}>한식 이미지</div>
                            )}
                            <div className={styles.productDetails}>
                                <p className={styles.productName}>김치찌개</p>
                                <p className={styles.productPrice}>15,000원</p>
                            </div>
                        </div>
                    </div>

                    {/* 중식 */}
                    <div className={styles.productCategory}>
                        <h4 className={styles.categoryHeader}>중식</h4>
                        <p className={styles.productCategorySubHeader}>CHINESE FOOD</p>
                        <div className={styles.productItem}>
                            {chineseFoodImg ? (
                                <img src={chineseFoodImg} alt="중식" className={styles.productImage} />
                            ) : (
                                <div className={styles.noImageText}>중식 이미지</div>
                            )}
                            <div className={styles.productDetails}>
                                <p className={styles.productName}>짜장면</p>
                                <p className={styles.productPrice}>12,000원</p>
                            </div>
                        </div>
                    </div>

                    {/* 일식 */}
                    <div className={styles.productCategory}>
                        <h4 className={styles.categoryHeader}>일식</h4>
                        <p className={styles.productCategorySubHeader}>JAPANESE FOOD</p>
                        <div className={styles.productItem}>
                            {japaneseFoodImg ? (
                                <img src={japaneseFoodImg} alt="일식" className={styles.productImage} />
                            ) : (
                                <div className={styles.noImageText}>일식 이미지</div>
                            )}
                            <div className={styles.productDetails}>
                                <p className={styles.productName}>초밥</p>
                                <p className={styles.productPrice}>25,000원</p>
                            </div>
                        </div>
                    </div>

                    {/* 양식 */}
                    <div className={styles.productCategory}>
                        <h4 className={styles.categoryHeader}>양식</h4>
                        <p className={styles.productCategorySubHeader}>WESTERN FOOD</p>
                        <div className={styles.productItem}>
                            {westernFoodImg ? (
                                <img src={westernFoodImg} alt="양식" className={styles.productImage} />
                            ) : (
                                <div className={styles.noImageText}>양식 이미지</div>
                            )}
                            <div className={styles.productDetails}>
                                <p className={styles.productName}>파스타</p>
                                <p className={styles.productPrice}>18,000원</p>
                            </div>
                        </div>
                    </div>

                    {/* 스낵 */}
                    <div className={styles.productCategory}>
                        <h4 className={styles.categoryHeader}>스낵</h4>
                        <p className={styles.productCategorySubHeader}>SNACK FOOD</p>
                        <div className={styles.productItem}>
                            {snackFoodImg ? (
                                <img src={snackFoodImg} alt="스낵" className={styles.productImage} />
                            ) : (
                                <div className={styles.noImageText}>스낵 이미지</div>
                            )}
                            <div className={styles.productDetails}>
                                <p className={styles.productName}>과자 세트</p>
                                <p className={styles.productPrice}>8,000원</p>
                            </div>
                        </div>
                    </div>

                    {/* 술집 */}
                    <div className={styles.productCategory}>
                        <h4 className={styles.categoryHeader}>술집</h4>
                        <p className={styles.productCategorySubHeader}>PUB FOOD</p>
                        <div className={styles.productItem}>
                            {pubFoodImg ? (
                                <img src={pubFoodImg} alt="술집" className={styles.productImage} />
                            ) : (
                                <div className={styles.noImageText}>술집 이미지</div>
                            )}
                            <div className={styles.productDetails}>
                                <p className={styles.productName}>치킨</p>
                                <p className={styles.productPrice}>22,000원</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 베스트 상품 섹션 */}
                <div className={styles.bestProducts}>
                    <h3 className={styles.bestProductsTitle}>베스트 상품</h3>
                    <div className={styles.bestProductsGrid}>
                        {/* 베스트 상품 1 */}
                        <div className={styles.bestProductItem}>
                            <div className={styles.bestProductImageWrapper}>
                                {bestProduct1 ? (
                                    <img src={bestProduct1} alt="버팔로윙" className={styles.bestProductImage} />
                                ) : (
                                    <div className={styles.noImageText}>이미지 없음</div>
                                )}
                            </div>
                            <p className={styles.bestProductRank}>BEST NO.1</p>
                            <p className={styles.bestProductName}>버팔로윙 1kg/사세</p>
                            <p className={styles.bestProductPrice}>17,400원</p>
                        </div>
                        {/* 베스트 상품 2 */}
                        <div className={styles.bestProductItem}>
                            <div className={styles.bestProductImageWrapper}>
                                {bestProduct2 ? (
                                    <img src={bestProduct2} alt="치킨데리야끼 볶음밥" className={styles.bestProductImage} />
                                ) : (
                                    <div className={styles.noImageText}>이미지 없음</div>
                                )}
                            </div>
                            <p className={styles.bestProductRank}>BEST NO.2</p>
                            <p className={styles.bestProductName}>치킨데리야끼볶음밥 300g/시아스</p>
                            <p className={styles.bestProductPrice}>1,540원</p>
                        </div>
                        {/* 베스트 상품 3 */}
                        <div className={styles.bestProductItem}>
                            <div className={styles.bestProductImageWrapper}>
                                {bestProduct3 ? (
                                    <img src={bestProduct3} alt="모짜렐라치즈" className={styles.bestProductImage} />
                                ) : (
                                    <div className={styles.noImageText}>이미지 없음</div>
                                )}
                            </div>
                            <p className={styles.bestProductRank}>BEST NO.3</p>
                            <p className={styles.bestProductName}>모짜렐라치즈EF 1Kg(자연치즈100%)</p>
                            <p className={styles.bestProductPrice}>12,200원</p>
                        </div>
                        {/* 베스트 상품 4 */}
                        <div className={styles.bestProductItem}>
                            <div className={styles.bestProductImageWrapper}>
                                {bestProduct4 ? (
                                    <img src={bestProduct4} alt="그린냉면육수" className={styles.bestProductImage} />
                                ) : (
                                    <div className={styles.noImageText}>이미지 없음</div>
                                )}
                            </div>
                            <p className={styles.bestProductRank}>BEST NO.4</p>
                            <p className={styles.bestProductName}>그린냉면육수 340g/맛찬들</p>
                            <p className={styles.bestProductPrice}>480원</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 장바구니 사이드바 */}
            {isCartOpen && (
                <div className={styles.cartSidebar}>
                    {/* 장바구니 헤더 */}
                    <div className={styles.cartHeader}>
                        <div className={styles.cartIconContainer}>
                            <span className={styles.cartIcon}>🛒</span>
                            <span className={styles.cartBadge}>0</span>
                        </div>
                        <h3 className={styles.cartTitle}>장바구니</h3>
                    </div>

                    {/* 장바구니 내용 */}
                    <div className={styles.cartContent}>
                        <div className={styles.cartEmpty}>
                            <p>장바구니가 비어있습니다</p>
                        </div>
                        <div className={styles.cartScrollButtons}>
                            <button className={styles.scrollButton}>▲</button>
                            <button className={styles.scrollButton}>▼</button>
                        </div>
                    </div>

                    {/* 장바구니 푸터 */}
                    <div className={styles.cartFooter}>
                        <div className={styles.cartTotal}>
                            <span className={styles.totalLabel}>총 합계</span>
                            <span className={styles.totalAmount}>0 원</span>
                        </div>
                        <div className={styles.cartButtons}>
                            <button className={styles.cartButton}>장바구니</button>
                            <button className={styles.buyAllButton}>모두구매</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainBody;