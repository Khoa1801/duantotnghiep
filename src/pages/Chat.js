import React, { useEffect, useState } from "react";
import "../css/chat.css";

const Chat = () => {
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/customers");
      const data = await response.json();
      const users = data.filter((customer) => customer.role === "user");
      setCustomers(users);

      const chatData = await fetchMessages(users);
      setChats(chatData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (users) => {
    try {
      const chatData = {};
      for (const user of users) {
        const response = await fetch(
          `http://localhost:3000/messages?id_user=${user.id}&email=${user.email}`
        );
        const messages = await response.json();
        chatData[user.email] = messages;
      }
      return chatData;
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
      return {};
    }
  };

  const handleSelectEmail = (email, id_user) => {
    setSelectedEmail(email === selectedEmail ? null : email);
    setSelectedUserId(email === selectedEmail ? null : id_user);
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedEmail || !selectedUserId) return;

    const newMessage = {
      email: selectedEmail,
      noi_dung: replyMessage,
      is_admin: 1,
      created_at: new Date().toISOString(),
      id_user: selectedUserId,
    };

    try {
      const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        setChats((prevChats) => ({
          ...prevChats,
          [selectedEmail]: [...(prevChats[selectedEmail] || []), newMessage],
        }));
        setReplyMessage("");
      } else {
        console.error("Lỗi khi gửi tin nhắn!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="khngu1">
      <aside className="khngu2">
        <h2>Danh sách khách hàng</h2>
        {loading ? (
          <p className="khngu3">Đang tải dữ liệu...</p>
        ) : (
          <ul className="khngu4">
            {customers.map((customer) => (
              <li
                key={customer.email}
                className={`khngu5 ${selectedEmail === customer.email ? "active" : ""}`}
                onClick={() => handleSelectEmail(customer.email, customer.id)}
              >
                {customer.email} ({chats[customer.email]?.length || 0} tin nhắn)
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main className="khngu6">
        {selectedEmail ? (
          <div className="khngu7">
            <div className="khngu8">Tin nhắn từ {selectedEmail}</div>
            <div className="khngu9">
              {chats[selectedEmail]?.map((chat) => (
                <div
                key={chat.id || chat.created_at}
                className={`khngu10 ${chat.is_admin == 1 ? "admin" : "user"}`}
              >
                <div className="khngu11">
                  <p>{chat.noi_dung}</p>
                  <span className="khngu12">
                    {new Date(chat.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              
              ))}
            </div>


            <div className="khngu13">
              <textarea
                placeholder="Nhập tin nhắn..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              ></textarea>
              <div className="khngu14">
                <button className="khngu15" onClick={handleReply}>Gửi</button>
                <button className="khngu16" onClick={() => setSelectedEmail(null)}>Hủy</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="khngu17">Chọn một khách hàng để hiển thị tin nhắn</div>
        )}
      </main>
    </div>
  );
};

export default Chat;
