import React, { useState } from 'react';
import styles from '../styles/Login/LoginPageBody.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 폼 데이터의 타입을 정의합니다.
interface LoginFormData {
  userId: string; // 백엔드에서는 email로 사용될 예정
  password: string;
}

// ✨ LoginPageBodyProps 인터페이스를 정의하여 onLoginSuccess prop을 받도록 합니다.
interface LoginPageBodyProps {
  onLoginSuccess: (token: string) => void;
}

// ✨ LoginPageBody 컴포넌트가 props로 onLoginSuccess를 받도록 수정합니다.
const LoginPageBody: React.FC<LoginPageBodyProps> = ({ onLoginSuccess }) => {
  // 폼 데이터 상태 관리
  const [loginData, setLoginData] = useState<LoginFormData>({
    userId: '',
    password: '',
  });

  // react-router-dom의 useNavigate 훅을 사용하여 페이지 이동
  const navigate = useNavigate(); // 이 navigate는 onLoginSuccess 내부에서 사용될 예정이므로, 여기서는 직접 사용하지 않도록 변경합니다.

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [id]: value, // userId 또는 password 필드 업데이트
    }));
  };

  // 폼 제출 핸들러 (로그인 로직)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작(페이지 새로고침) 방지

    console.log('로그인 시도 데이터:', loginData);

    try {
      // 백엔드 로그인 API 호출
      const response = await axios.post('http://localhost:8080/login', {
        email: loginData.userId,
        password: loginData.password,
      });

      console.log('로그인 성공:', response.data);

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken); // 서버에서 받은 JWT 토큰 저장 (Local Storage 권장)

      // ✨ App.tsx로 토큰을 전달하여 전역 상태를 업데이트하고 페이지 이동을 App.tsx에서 처리하도록 합니다.
      onLoginSuccess(accessToken);

      alert('로그인 성공!');
      // ✨ navigate('/HomePage'); // 이 부분은 onLoginSuccess 내부에서 처리되므로 여기서는 제거하거나 주석 처리합니다.

    } catch (error) {
      console.error('로그인 실패:', error);

      if (axios.isAxiosError(error) && error.response) {
        alert('로그인 실패: ' + (error.response.data.message || '아이디 또는 비밀번호를 확인해주세요.'));
      } else {
        alert('로그인 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <form className={styles.memberSection} onSubmit={handleSubmit}>
          <h2 className={styles.memberTitle}>회원 로그인</h2>
          <p className={styles.memberDesc}>
            가입하신 아이디와 비밀번호를 입력해주세요.<br />
            비밀번호는 대소문자를 구분합니다.
          </p>
          <div className={styles.inputGroup}>
            <label htmlFor="userId">아이디</label>
            <input
              id="userId"
              type="text"
              className={styles.input}
              value={loginData.userId}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={loginData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.options}>
            <label><input type="checkbox" /> 아이디저장</label>
            <label><input type="checkbox" /> 자동 로그인</label>
          </div>
          <button type="submit" className={styles.loginBtn}>로그인</button>
          <div className={styles.snsLogin}>
            <button className={styles.naverBtn}>네이버 로그인</button>
            <button className={styles.kakaoBtn}>카카오톡 로그인</button>
          </div>
        </form>

        <div className={styles.nonMemberSection}>
          <h2 className={styles.nonMemberTitle}>비회원 주문조회</h2>
          <div className={styles.radioGroup}>
            <label><input type="radio" name="orderType" defaultChecked /> 주문배송조회</label>
            <label><input type="radio" name="orderType" /> 주문하기</label>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="orderNumber">주문번호</label>
            <input id="orderNumber" type="text" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">전화번호</label>
            <div className={styles.phoneInputs}>
              <input type="text" maxLength={3} className={styles.input} /> -
              <input type="text" maxLength={4} className={styles.input} /> -
              <input type="text" maxLength={4} className={styles.input} />
            </div>
          </div>
          <button className={styles.nonMemberBtn}>비회원 로그인</button>
        </div>
      </div>
      <div className={styles.bottomInfo}>
        회원으로 가입하시면 쿠폰, 적립금 등 다양한 혜택을 받으실 수 있습니다. <span className={styles.joinLink}>회원가입하기 &gt;</span><br />
        아이디와 비밀번호를 잊으셨나요? <span className={styles.findLink}>아이디 찾기 &gt;</span> <span className={styles.findLink}>비밀번호 찾기 &gt;</span>
      </div>
    </div>
  );
};

export default LoginPageBody;