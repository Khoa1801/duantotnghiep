import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = (e) => {
    if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    } else {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
        method: 'POST', // Gửi yêu cầu POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }), // Gửi mật khẩu mới
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đặt lại mật khẩu thất bại.");
      }

      setMessage("Mật khẩu đã được đặt lại thành công.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Đặt lại mật khẩu</h2>

      <label>Mật khẩu mới:</label>
      <input
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={handlePasswordChange}
        required
      />

      <label>Xác nhận mật khẩu:</label>
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handlePasswordChange}
        required
      />

      {message && <p className="message">{message}</p>}

      <button onClick={handleSubmit}>Cập nhật mật khẩu</button>
    </div>
  );
};

export default ResetPassword;
