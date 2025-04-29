import { Link, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiHome,
  FiMessageSquare,
  FiBox,
  FiList,
  FiShoppingCart,
  FiStar,
  FiHelpCircle,
  FiTag,
  FiEdit,
  FiUser,
  FiBarChart,
  FiFileText
} from "react-icons/fi";
import { useState } from "react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { to: "/admin/weekly-stats", icon: <FiHome />, text: "Tổng quan" },
    { to: "/admin/chat", icon: <FiMessageSquare />, text: "Chat với khách hàng" },
    { to: "/admin/products", icon: <FiBox />, text: "Quản lý sản phẩm" },
    { to: "/admin/categories", icon: <FiList />, text: "Quản lý danh mục" },
    { to: "/admin/orders", icon: <FiShoppingCart />, text: "Quản lý đơn hàng" },
    { to: "/admin/order-details", icon: <FiFileText />, text: "Quản lý chi tiết đơn hàng" },
    { to: "/admin/feedback", icon: <FiStar />, text: "Phản hồi & Đánh giá" },
    { to: "/admin/vouchers", icon: <FiTag />, text: "Quản lý voucher" },
    { to: "/admin/blog", icon: <FiEdit />, text: "Quản lý blog" },
    { to: "/admin/accounts", icon: <FiUser />, text: "Quản lý tài khoản" },
    { to: "/admin/statistics", icon: <FiBarChart />, text: "Thống kê" },
  ];

  return (
    <div className={`d-flex flex-column bg-dark text-white p-3 ${isCollapsed ? "collapsed-sidebar" : ""}`} style={{ height: "100vh", width: isCollapsed ? "80px" : "250px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {!isCollapsed && <h5 className="m-0">ShoesChill Admin</h5>}
        <button className="btn btn-outline-light" onClick={() => setIsCollapsed(!isCollapsed)}>
          <FiMenu size={24} />
        </button>
      </div>

      <nav className="nav flex-column">
        {menuItems.map((item) => (
          <Link 
            key={item.to} 
            to={item.to} 
            className={`nav-link d-flex align-items-center ${location.pathname === item.to ? "active bg-secondary" : "text-white"}`}
          >
            <span className="me-2">{item.icon}</span>
            {!isCollapsed && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;