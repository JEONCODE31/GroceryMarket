import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/CustomerSupport/CustomerSupportChat.module.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

const CustomerSupportChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081/chat');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('웹소켓 연결됨');
      setIsConnected(true);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: '안녕하세요! 고객센터입니다. 무엇을 도와드릴까요?',
          sender: 'admin',
          timestamp: new Date()
        }
      ]);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message.text,
          sender: 'admin',
          timestamp: new Date()
        }
      ]);
    };

    ws.onclose = () => {
      console.log('웹소켓 연결 종료');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('웹소켓 에러:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ text: inputMessage, sender: 'user' }));
    }

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isMinimized) {
    return (
      <div className={styles.minimizedChat}>
        <button className={styles.maximizeButton} onClick={() => setIsMinimized(false)}>
          💬 고객센터 채팅
        </button>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3>고객센터 채팅</h3>
        <div className={styles.headerButtons}>
          <span className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            {isConnected ? '●' : '○'}
          </span>
          <button className={styles.minimizeButton} onClick={() => setIsMinimized(true)}>
            _
          </button>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.sender === 'user' ? styles.userWrapper : styles.adminWrapper
            }`}
          >
            <div
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.adminMessage
              }`}
            >
              <div className={styles.messageContent}>{message.text}</div>
              <div className={styles.messageTime}>{message.timestamp.toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className={styles.messageInput}
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!inputMessage.trim() || !isConnected} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default CustomerSupportChat;
