import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Dangki.css';  // Đảm bảo bạn đã import đúng file CSS

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Trường nhập lại mật khẩu
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Reset thông báo
    setError('');
    setSuccess('');
  
    // 1. Kiểm tra đầu vào
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
  
    // 2. Kiểm tra khớp mật khẩu
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
  
    // 3. Gửi yêu cầu đến API
    try {
      const response = await axios.post('http://localhost:3000/register', {
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
      });
  
      setSuccess(response.data.message);
      setError('');
  
      setTimeout(() => {
        navigate('/dangnhap');
      }, 1000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
      setSuccess('');
    }
  };
  

  return (
    <div className="container">
      <div className="register-card">
        <h2 className="register-title">Đăng Ký</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Họ và tên</label>
            <input
              type="text"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>
          <div className="input-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>
        <footer>
          <p>Đã có tài khoản? <a href="/dangnhap">Đăng nhập ngay</a></p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
