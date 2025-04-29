import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import '../css/Footer.css';

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer Main Container */}
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-logo">
          <h2>ShoesChill</h2>
          <p>Phong cách và chất lượng hàng đầu.</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Danh mục sản phẩm</a></li>
            <li><a href="#">Blog thời trang</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Về chúng tôi</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="footer-section">
          <h4>Nhận thông tin mới</h4>
          <p>Đăng ký để nhận khuyến mãi và thông tin mới nhất.</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Đăng ký
            </button>
          </form>
        </div>

        {/* Contact Information Section */}
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <ul>
            <li>
              <FaPhoneAlt /> (+84) 123 456 789
            </li>
            <li>
              <FaEnvelope /> support@shoeschill.com
            </li>
            <li>
              Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-socials">
          <h4>Kết nối với chúng tôi</h4>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <FaFacebook />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon">
              <FaTwitter />
            </a>
            <a href="#" className="social-icon">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 ShoesChill. All Rights Reserved.</p>
        <p>
          Thiết kế bởi <a href="#">ShoesChill Team</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
