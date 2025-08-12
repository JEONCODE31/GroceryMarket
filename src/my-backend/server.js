// server.js

// 라이브러리 불러오기
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 8082; // 8082 포트 사용하도록 변경

// 미들웨어 설정 - 필수
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 형식의 요청 본문 파싱

// 환경 변수에서 값 가져오기
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID_BACKEND;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Google OAuth 클라이언트 초기화
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Google ID 토큰을 검증하고 사용자 정보를 추출하는 함수
 */
async function verifyIdToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload; // { email: '...', name: '...', ... }
  } catch (error) {
    console.error('ID Token 검증 실패:', error);
    return null;
  }
}

/**
 * Google 로그인 처리 API 엔드포인트
 * POST /api/auth/google
 */
app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'idToken이 필요합니다.' });
  }

  // 1. Google ID 토큰 검증
  const userInfo = await verifyIdToken(idToken);

  if (!userInfo) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  // 2. 사용자 데이터베이스 처리 로직은 나중에 추가
  // 지금은 더미 사용자 객체를 사용합니다.
  const user = {
    email: userInfo.email,
    username: userInfo.name,
    role: 'user', 
  };

  // 3. 우리 서비스용 JWT 토큰 발급
  const serviceToken = jwt.sign(
    { email: user.email, role: user.role },
    JWT_SECRET_KEY,
    { expiresIn: '1h' } // 토큰 만료 시간
  );

  // 4. 프론트엔드로 응답 보내기
  res.status(200).json({
    message: '로그인 성공',
    accessToken: serviceToken,
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});