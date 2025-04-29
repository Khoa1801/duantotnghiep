import React, { useState } from "react";
import "../css/Settings.css";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [email, setEmail] = useState(""); // Thêm state cho email
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Kiểm soát hiển thị quên mật khẩu

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(
        `http://localhost:3000/users/${user.id}/change-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");

      setMessage("Đổi mật khẩu thành công!");
    } catch (error) {
      setMessage(error.message);
    }
  };
  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Vui lòng nhập email.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      // Kiểm tra nếu server trả về HTML (thay vì JSON)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Lỗi server: Phản hồi không hợp lệ.");
      }
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message || "Lỗi gửi email.");
  
      setMessage("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      setMessage(error.message);
    }
  };
  
  return (
    <div className="change-password-container">
      <h2>Đổi Mật Khẩu</h2>

      {!showForgotPassword ? (
        <>
          <label>Mật khẩu hiện tại:</label>
          <input type="password" name="oldPassword" onChange={handleChange} />

          <label>Mật khẩu mới:</label>
          <input type="password" name="newPassword" onChange={handleChange} />

          <label>Xác nhận mật khẩu mới:</label>
          <input type="password" name="confirmPassword" onChange={handleChange} />

          {message && <p className="message">{message}</p>}

          <button className="save-button" onClick={handleSave}>
            Lưu thay đổi
          </button>

          <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>
            Quên mật khẩu?
          </p>
        </>
      ) : (
        <>
          <h3>Quên mật khẩu</h3>
          <label>Nhập email của bạn:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" />

          {message && <p className="message">{message}</p>}

          <button className="save-button" onClick={handleForgotPassword}>
            Gửi email đặt lại mật khẩu
          </button>

          <p className="back-to-login" onClick={() => setShowForgotPassword(false)}>
            Quay lại
          </p>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
