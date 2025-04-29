import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/ChatBox.css"
import { FaCommentDots } from 'react-icons/fa'; // Icon chat

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Vui lòng đăng nhập trước khi sử dụng ChatBox');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customers/${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        setError('Không thể lấy thông tin người dùng!');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/messages?id_user=${userInfo.id}&email=${userInfo.email}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy tin nhắn:', error);
        }
      };

      fetchMessages();
    }
  }, [userInfo]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage) {
      setError('Nội dung tin nhắn không được để trống!');
      return;
    }
    if (!userInfo) {
      setError('Vui lòng đăng nhập để gửi tin nhắn!');
      return;
    }

    try {
      await axios.post('http://localhost:3000/messages', {
        email: userInfo.email,
        noi_dung: newMessage,
        is_admin: 0,
        id_user: userInfo.id,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { email: userInfo.email, noi_dung: newMessage, created_at: new Date().toISOString() },
      ]);
      setNewMessage('');
      setError('');
    } catch (error) {
      setError('Lỗi khi gửi tin nhắn. Vui lòng thử lại!');
    }
  };

  return (
    <>
      {/* Nút mở ChatBox */}
      <div className="chat-icon" onClick={() => setIsOpen(!isOpen)}>
        <FaCommentDots size={30} />
      </div>
  
      {/* ChatBox hiển thị khi mở */}
      {isOpen && (
        <div className="chat-box">
          <h2>Chat với Admin</h2>
          {error && <div className="error-message">{error}</div>}
          {userInfo && (
            <div className="user-info">
              <p><strong>Họ tên:</strong> {userInfo.full_name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
            </div>
          )}
          <div className="messages">
            <h3>Tin nhắn của bạn:</h3>
            {messages.length === 0 ? (
              <p>Chưa có tin nhắn nào.</p>
            ) : (
              <ul>
                {messages.map((message, index) => (
                  <li key={index}>
                    <strong>
                      {message.is_admin === 1 ? "Admin" : message.email}
                    </strong>
                    : {message.noi_dung}
                    <br />
                    <small>{new Date(message.created_at).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="send-message">
            <textarea
              placeholder="Nhập nội dung tin nhắn"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Gửi tin nhắn</button>
          </form>
        </div>
      )}
    </>
  );  
};

export default ChatBox;
