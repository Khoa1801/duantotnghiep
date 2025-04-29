import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Navbar.css"; // Import external CSS file

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Giả sử có 3 thông báo
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("storage"));

    alert("Đã đăng xuất!");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`navbar-4 ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="container-4">
        <form className="search-bar-4">
          <input
            className="search-input-4"
            type="search"
            placeholder="Tìm kiếm..."
          />
          <button className="search-button-4" type="submit">
            Tìm kiếm
          </button>
        </form>

        <div className="right-section-4">
          <button className="dark-mode-btn-4" onClick={toggleDarkMode}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {/* <button className="notification-btn-4">
            🔔
            {notifications > 0 && (
              <span className="notification-badge-4">{notifications}</span>
            )}
          </button> */}

          <div className="user-menu-4">
            <button className="user-btn-4" onClick={() => setIsUserMenuOpen((prev) => !prev)}>
              ADMIN
            </button>
            {isUserMenuOpen && (
              <ul className="user-dropdown-4" ref={dropdownRef}>
                <li>
                  <button className="dropdown-item-4">Cài đặt</button>
                </li>
                <li>
                  <button className="dropdown-item-4" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
