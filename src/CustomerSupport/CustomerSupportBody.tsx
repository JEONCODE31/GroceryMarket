import React, { useState } from "react";
import styles from "../styles/CustomerSupport/CustomerSupportChat.module.css";

const CustomerBody = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    category: "기타",
    subject: "",
    message: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 여기에 실제 서버 제출 로직 추가
    console.log("제출된 문의:", form);
    alert("문의가 등록되었습니다.");
  };

  return (
    <div className={styles.customerBox}>
      <h2 className={styles.title}>고객 상담 신청</h2>
      <form onSubmit={handleSubmit} className={styles.inquiryForm}>
        <label>
          이름
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          연락처
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>

        <label>
          이메일
          <input name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          비밀번호
          <input name="password" value={form.password} onChange={handleChange} required />
        </label>

        <label>
          분류
          <div>
            기타{" "}
            <span style={{ fontSize: "12px", color: "gray" }}>
              (비밀글로 등록됩니다.)
            </span>
          </div>
        </label>

        <label>
          문의제목
          <input name="subject" value={form.subject} onChange={handleChange} required />
        </label>

        <label>
          문의내용
          <textarea name="message" value={form.message} onChange={handleChange} required />
        </label>

        <label>
          첨부이미지
          <input name="file" type="file" onChange={handleChange} />
        </label>

        <div className={styles.buttonBox}>
          <button type="submit" className={styles.submitButton}>
            상담신청
          </button>
          <button type="reset" className={styles.cancelButton}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerBody;
