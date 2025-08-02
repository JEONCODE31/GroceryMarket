import React, { useState } from 'react'; // useState를 사용하므로 반드시 임포트해야 합니다.
import styles from '../styles/Register/RegisterBody.module.css';
import api from '../util/api'; // api 인스턴스를 util/api에서 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import axios from 'axios'; // axios 임포트 (isAxiosError 사용 위함)

const RegisterBody: React.FC = () => {
  // useNavigate 훅을 컴포넌트 최상위에서 호출
  const navigate = useNavigate();

  // ✨ formData의 필드 이름을 백엔드 DTO에 맞게 수정
  const [formData, setFormData] = useState<{
    username: string; // 'name' 대신 'username'
    phoneNumber: string; // 'phone' 대신 'phoneNumber'
    password: string;
    email: string;
    address: string;
  }>({ username: '', phoneNumber: '', password: '', email: '', address: '' }); // 초기값도 변경

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    console.log('회원가입 취소');
    window.history.back(); // 이전 페이지로 돌아가기
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    console.log('최종 제출 데이터:', formData); //

    try {
      // api 인스턴스를 사용하여 POST 요청을 보냅니다.
      // await 키워드를 사용하여 응답을 기다립니다.
      const response = await api.post('/register', formData); //

      console.log('회원가입 성공 응답:', response.data);
      alert('회원가입이 성공적으로 완료되었습니다!');

      // react-router-dom의 navigate 훅을 사용하여 페이지 이동
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패 오류:', error); //

      // axios 오류인지 확인하고, 서버에서 보낸 메시지 표시
      if (axios.isAxiosError(error) && error.response) { //
        // 백엔드에서 보낸 에러 메시지를 alert에 표시
        alert(`회원가입 실패: ${error.response.data.message || '알 수 없는 서버 오류'}`); //
      } else {
        alert('회원가입 중 네트워크 오류가 발생했습니다.'); //
      }
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.breadcrumb}>홈 &gt; 회원정보입력</div>
      <h1 className={styles.mainTitle}>회원정보입력</h1>
      <div className={styles.formContainer}>
        <h2 className={styles.sectionTitle}>기본 정보 입력 (필수 입력 정보 영역입니다.)</h2>
        {/* onSubmit에 handleSubmit 함수 연결 */}
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {/* 이름 필드: name="username"으로 변경 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>사용자 이름</label> {/* 레이블도 명확히 */}
            <input
              type="text"
              name="username" // ✨ 'name'에서 'username'으로 변경
              value={formData.username} // ✨ formData.name에서 formData.username으로 변경
              onChange={handleInputChange}
              className={styles.input}
              placeholder="사용자 이름을 3~100자 이내로 입력하세요" // 안내 문구 추가
            />
          </div>
          {/* 비밀번호 필드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="비밀번호를 최소 8자 이상으로 입력하세요" // ✨ 최소 길이 안내 추가
            />
          </div>
          {/* 이메일 필드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="유효한 이메일 형식을 입력해주세요"
            />
          </div>
          {/* 전화번호 필드: name="phoneNumber"로 변경 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>전화번호</label>
            <input
              type="text"
              name="phoneNumber" // ✨ 'phone'에서 'phoneNumber'로 변경
              value={formData.phoneNumber} // ✨ formData.phone에서 formData.phoneNumber으로 변경
              onChange={handleInputChange}
              className={styles.input}
              placeholder="-제외한 전화번호를 입력하세요"
            />
          </div>
          {/* 배송주소 필드 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>배송주소</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="주소를 입력하세요"
            />
          </div>
          {/* 버튼 */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>확인</button>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBody;