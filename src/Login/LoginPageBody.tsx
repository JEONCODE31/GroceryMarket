import React, { useState } from 'react';
import styles from '../styles/Login/LoginPageBody.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

// 폼 데이터의 타입을 정의합니다.
interface LoginFormData {
  userId: string; // 백엔드에서는 email로 사용될 예정
  password: string;
}

interface LoginPageBodyProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPageBody: React.FC<LoginPageBodyProps> = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    userId: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };

  // 일반 로그인 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('일반 로그인 시도 데이터:', loginData);

    try {
      // 일반 로그인 API는 8080 포트 사용
      const response = await axios.post('http://localhost:8080/login', {
        email: loginData.userId,
        password: loginData.password,
      });

      console.log('로그인 성공:', response.data);

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      onLoginSuccess(accessToken);

      alert('로그인 성공!');

    } catch (error) {
      console.error('로그인 실패:', error);

      if (axios.isAxiosError(error) && error.response) {
        alert('로그인 실패: ' + (error.response.data.message || '아이디 또는 비밀번호를 확인해주세요.'));
      } else {
        alert('로그인 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // Google 로그인 성공 시 핸들러
  const handleGoogleLoginSuccess = async (cred) => {
    try {
      const idToken = cred.credential;
      if (!idToken) {
        alert('구글 로그인 토큰을 받지 못했습니다.');
        return;
      }
      
      // ✅ 구글 로그인 백엔드 API는 8082 포트 사용
      const { data } = await axios.post('http://localhost:8082/auth/google', { idToken });

      localStorage.setItem('accessToken', data.accessToken);

      onLoginSuccess(data.accessToken);
      alert('구글 로그인 성공!');
    } catch (e: any) {
      console.error(e);
      alert('구글 로그인 실패: ' + (e.response?.data?.message ?? '서버 오류'));
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
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                alert('구글 로그인에 실패했습니다.');
              }}
              useOneTap
            />
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