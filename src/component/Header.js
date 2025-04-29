import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaShoppingCart, 
  FaUserCircle, 
  FaUserPlus, 
  FaSignInAlt 
} from "react-icons/fa";
import "../css/Header.css";

const API_BASE_URL = "http://localhost:3000";

const Header = () => {
  // State management
  const [isScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState({
    user: false,
    role: false,
    orders: false,
    vouchers: false,
    search: false
  });

  // Refs
  const searchInputRef = useRef(null);
  const userDropdownRef = useRef(null);
  const authMenuRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data from localStorage
  const fetchUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user:", error);
      setUser(null);
    }
  }, []);

  // Fetch user role
  const fetchUserRole = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(prev => ({...prev, role: true}));
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/role`);
      if (!response.ok) throw new Error("Failed to fetch role");
      const data = await response.json();
      setRole(data.role);
    } catch (error) {
      console.error("Role fetch error:", error);
    } finally {
      setLoading(prev => ({...prev, role: false}));
    }
  }, [user?.id]);

  // Fetch orders and vouchers
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(prev => ({...prev, orders: true, vouchers: true}));
    try {
      const [ordersRes, vouchersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/orders?id_user=${user.id}`),
        fetch(`${API_BASE_URL}/vouchers?user_id=${user.id}`)
      ]);

      if (!ordersRes.ok || !vouchersRes.ok) throw new Error("Failed to fetch data");

      const ordersData = await ordersRes.json();
      const vouchersData = await vouchersRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setVouchers(Array.isArray(vouchersData) ? vouchersData : []);
    } catch (error) {
      console.error("Data fetch error:", error);
      setOrders([]);
      setVouchers([]);
    } finally {
      setLoading(prev => ({...prev, orders: false, vouchers: false}));
    }
  }, [user?.id]);

  // Search products
  const searchProducts = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(prev => ({...prev, search: true}));
    try {
      const response = await fetch(
        `${API_BASE_URL}/timkiem?keyword=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(prev => ({...prev, search: false}));
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, searchProducts]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowAuthMenu(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Event handlers
  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setShowAuthMenu(prev => !prev);
  };

  const handleSelectProduct = (id) => {
    setKeyword("");
    setSearchResults([]);
    setShowSearchResults(false);
    searchInputRef.current?.blur();
    navigate(`/chitiet/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    setShowAuthMenu(false);
    navigate("/");
  };

  // Initial data loading
  useEffect(() => {
    fetchUser();
    
    const handleStorageChange = () => fetchUser();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchUser]);

  useEffect(() => {
    fetchUserRole();
    fetchUserData();
  }, [fetchUserRole, fetchUserData]);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link to="/">ShoesChill</Link>
      </div>

      <div className="search-bar">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-input"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setShowSearchResults(true)}
        />
        <button 
          className="search-button"
          aria-label="Search"
        >
          <FaSearch />
        </button>
        
        {showSearchResults && (
          <div className="search-results">
            {loading.search ? (
              <div className="loading-spinner">Đang tải...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  className="search-item"
                  onClick={() => handleSelectProduct(product.id)}
                >
                  <img 
                    src={product.hinh || '/placeholder-product.jpg'} 
                    alt={product.ten_sp} 
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className="search-info">
                    <p className="product-name">{product.ten_sp}</p>
                    <p className="product-price">
                      {product.gia_khuyen_mai 
                        ? `${product.gia_khuyen_mai.toLocaleString()}₫`
                        : `${product.gia_goc.toLocaleString()}₫`}
                    </p>
                  </div>
                </div>
              ))
            ) : keyword && (
              <div className="no-results">Không tìm thấy sản phẩm</div>
            )}
          </div>
        )}
      </div>

      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/products">Sản phẩm</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/lienhe">Liên hệ</Link>
        {role === "admin" && <Link to="/admin">Quản trị</Link>}
      </nav>

      <div className="auth-section">
        <div ref={userDropdownRef} className="user-dropdown">
          <FaUserCircle className="user-icon" onClick={handleToggleMenu} />

          <div className={`auth-menu ${showAuthMenu ? "show" : ""}`}>
            {user ? (
              <>
                <span className="username">
                  Xin chào, {user.full_name || user.phone || "User"}!
                </span>

                {/* Orders section */}
                <div className="order-check">
                  <h4>Đơn hàng của bạn</h4>
                  {orders.length > 0 ? (
                    <ul className="order-list">
                      {orders.map((order) => (
                        <li key={order.id_dh} className="order-item">
                          <Link to={`/orders/${order.id_dh}`} className="order-link">
                            #{order.id_dh}
                          </Link>
                          <span className="order-price">
                            {order.tong_tien.toLocaleString("vi-VN")}₫
                          </span>
                          <span
                            className={`order-status ${
                              order.status === "Đã giao"
                                ? "status-completed"
                                : order.status === "Đang xử lý"
                                ? "status-pending"
                                : "status-cancelled"
                            }`}
                          >
                            {order.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-orders">Không có đơn hàng nào</p>
                  )}
                </div>

                {/* Vouchers section */}
                <div className="voucher-list">
                  <h4>Voucher của bạn</h4>
                  {vouchers.length > 0 ? (
                    <ul>
                      {vouchers.map((voucher) => (
                        <li key={voucher.code} className="voucher-item">
                          {voucher.code} - Giảm {voucher.discount}%
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có voucher nào</p>
                  )}
                </div>

                {/* Settings and Profile */}
                <button className="settings-button" onClick={() => navigate("/settings")}>
                  Cài đặt tài khoản
                </button>
                <button
                  className="edit-profile-button"
                  onClick={() => navigate("/profile")}
                >
                  Chỉnh sửa thông tin
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="auth-actions">
                <Link to="/dangki" className="auth-btn signup-btn">
                  <FaUserPlus className="auth-icon" /> Đăng ký
                </Link>
                <Link to="/dangnhap" className="auth-btn login-btn">
                  <FaSignInAlt className="auth-icon" /> Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>

        <Link to={user ? `/giohang/${user.id}` : "/giohang"} className="cart-link">
          <FaShoppingCart />
        </Link>
      </div> 
    </header>
  );
};

export default Header;