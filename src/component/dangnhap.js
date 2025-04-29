import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dangnhap.css";

const DangNhap = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi khi đọc user từ localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (window.location.hash === '#_=_') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    const userId = document.cookie.split('; ').find(row => row.startsWith('userId='));
    const userName = document.cookie.split('; ').find(row => row.startsWith('userName='));

    if (userId && userName) {
      const id = userId.split('=')[1];
      const name = decodeURIComponent(userName.split('=')[1]);
      const userData = { id, name };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setSuccess('Đăng nhập thành công!');
      navigate('/');
    }
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!phone || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    try {
      // Gửi yêu cầu đăng nhập
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại.");
      }
  
      if (!data.user || !data.user.id) {
        throw new Error("Dữ liệu trả về không hợp lệ.");
      }
  
      // Gọi API lấy vai trò người dùng
      const roleResponse = await fetch(`http://localhost:3000/users/${data.user.id}/role`);
      const roleData = await roleResponse.json();
  
      if (!roleResponse.ok) {
        throw new Error(roleData.message || "Không thể lấy vai trò người dùng.");
      }
  
      // Lưu thông tin người dùng + role vào localStorage
      const userData = { ...data.user, role: roleData.role };
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", roleData.role); // Lưu riêng role
  
      // Gửi sự kiện để các component khác cập nhật
      window.dispatchEvent(new Event("storage"));
  
      setSuccess("Đăng nhập thành công!");
      setError("");
  
      // Không điều hướng nữa
      // navigate("/admin") hoặc navigate("/") đã bị bỏ
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message);
      setSuccess("");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setSuccess("Đã đăng xuất.");
    setError("");
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

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:3000/auth/facebook";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {user ? (
          <>
            <h2 className="login-title">Xin chào, {user.name || "User"}!</h2>
            <button className="logout-button" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : showForgotPassword ? (
          <>
            <h2 className="login-title">Quên Mật Khẩu</h2>
            <div className="input-group">
              <label>Nhập email của bạn:</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>
            {message && <p className="message">{message}</p>}
            <button className="save-button" onClick={handleForgotPassword}>
              Gửi email đặt lại mật khẩu
            </button>
            <p className="back-to-login" onClick={() => setShowForgotPassword(false)}>
              Quay lại đăng nhập
            </p>
          </>
        ) : (
          <>
            <h2 className="login-title">Đăng Nhập</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Số điện thoại</label>
                <input
                  className="input-field"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="input-group">
                <label>Mật khẩu</label>
                <input
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button className="login-button" type="submit">
                Đăng nhập
              </button>
            </form>
            <button
              className="facebook-login-button custom-facebook-login"
              onClick={handleFacebookLogin}
            >
              Đăng nhập bằng Facebook
            </button>
            <button
              className="google-login-button custom-google-login"
              onClick={handleGoogleLogin}
            >
              Đăng nhập bằng Google
            </button>
            <p className="forgot-password custom-forgot-password" onClick={() => setShowForgotPassword(true)}>
              Quên mật khẩu?
            </p>

          </>
        )}
      </div>
    </div>
  );
};

export default DangNhap;
