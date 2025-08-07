const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const Chat = require("./chat"); // Chat 모델 (chat.js)
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// ✅ 포트 8081 사용, 경로는 /chat
const wss = new WebSocket.Server({ server, path: "/chat" });

app.use(cors());
app.use(express.json());

// ✅ MongoDB 연결
mongoose.connect("mongodb://localhost:27017/chatDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB 연결 성공 (chatDB)");
});

// ✅ WebSocket 연결 처리
wss.on("connection", (ws) => {
  console.log("💬 클라이언트 연결됨");

  // 클라이언트로부터 메시지 수신
  ws.on("message", async (message) => {
    console.log("📨 수신 메시지:", message);

    const parsed = JSON.parse(message);

    // DB 저장
    const chat = new Chat({
      sender: parsed.sender,
      text: parsed.text,
      timestamp: new Date(),
    });

    await chat.save();

    // ✅ 본인을 제외한 클라이언트에게만 전송
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(chat));
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ 클라이언트 연결 종료");
  });
});

// ✅ 서버 실행
server.listen(8081, () => {
  console.log("🚀 서버가 http://localhost:8081 에서 실행 중입니다");
});
