import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/App.css";
// import VnpayCheckout from './components/VnpayCheckout'; // chỉnh đường dẫn nếu khác
// Import giao diện người dùng
import Header from "./component/Header";
import Footer from "./component/Footer";
import Banner from "./component/Banner";
import Category from "./component/Category";
import ProductList from "./component/ProductList";
import Tintuc from "./component/Tintuc";
import CheckoutNow from "./component/MuaNgay";
import ProductPage from "./component/Shop";
import Blog from "./component/Blog";
import DangKi from "./component/dangki";
import Login from "./component/dangnhap";
import ChatBox from "./component/ChatBox";
import KhuyenMai from "./component/KhuyenMai";
import SPTrongLoai from "./component/SPTrongLoai";
import BlogDetail from "./component/BlogDetail";
import GioHang from "./component/Cart";
import ChiTietDH from "./component/ChiTietDH";
import ContactForm from "./component/lienhe";
import GiaoHangBaoHanh from "./component/ExtraInfo";
import ResetPassword from "./component/ResetPassword";
import ScrollToTop from "./component/ScrollToTop";
import Profile from "./component/Profile";
import Settings from "./component/Settings";
import ChiTiet from "./component/chitiet";
import PaymentResultPage from "./component/PaymentResultPage";


// Import giao diện Admin
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Chat from "./pages/Chat";
import ProductManagement from "./pages/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement";
import OrderDetails from "./pages/Orders";
import OrderManagement from "./pages/OrderManagement";
import Feedback from "./pages/Feedback";
import VoucherManagement from "./pages/VoucherManagement";
import BlogManagement from "./pages/BlogManagement";
import AccountManagement from "./pages/AccountManagement";
import Statistics from "./pages/Statistics";

const App = () => {
    const [role, setRole] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/";
    const hideChatOnPages = ["/checkout", "/blog"];
    const showChat = !hideChatOnPages.includes(location.pathname);

    useEffect(() => {
        
            const fetchUserRole = async () => {
                try {
                    const storedUser = JSON.parse(localStorage.getItem("user"));
        
                    if (!storedUser || !storedUser.id) {
                        setRole("user");
                        return;
                    }
        
                    const response = await fetch(`http://localhost:3000/users/${storedUser.id}/role`);
                    const data = await response.json();
        
                    if (!response.ok) {
                        throw new Error(data.message || "Không thể lấy vai trò người dùng.");
                    }
        
                    setRole(data.role);
        
                    if (data.role === "admin" && !location.pathname.startsWith("/admin")) {
                        navigate("/");
                    } else if (data.role !== "admin" && location.pathname.startsWith("/admin")) {
                        // Nếu là user nhưng đang ở /admin, chuyển hướng về trang chủ
                        navigate("/");
                    }
        
                } catch (error) {
                    console.error("Lỗi khi lấy vai trò người dùng:", error);
                    setRole("user");
                    if (location.pathname.startsWith("/admin")) {
                        navigate("/");
                    }
                }
            };
        
            fetchUserRole();
        }, [location.pathname, navigate]);
        
    return (
        <div className="app-container">
            <ToastContainer />
            
            {role === "admin" ? (
                // Giao diện Admin
                <div className="d-flex vh-100">
                {/* Sidebar */}
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          
                {/* Main Content */}
                <div className="d-flex flex-column flex-grow-1">
                  <Navbar />
          
                  {/* Nội dung chính */}
                  <div className="flex-grow-1 p-4 overflow-auto">
                    <Routes>
                      <Route path="/admin/weekly-stats" element={<Overview />} />
                      <Route path="/admin/chat" element={<Chat />} />
                      <Route path="/admin/products" element={<ProductManagement />} />
                      <Route path="/admin/categories" element={<CategoryManagement />} />
                      <Route path="/admin/orders" element={<OrderManagement />} />
                      <Route path="/admin/order-details" element={<OrderDetails />} />
                      <Route path="/admin/feedback" element={<Feedback />} />
                      <Route path="/admin/vouchers" element={<VoucherManagement />} />
                      <Route path="/admin/blog" element={<BlogManagement />} />
                      <Route path="/admin/accounts" element={<AccountManagement />} />
                      <Route path="/admin/statistics" element={<Statistics />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
                // Giao diện người dùng
                <>
                    <Header />
                    <Banner />
                    {isHomePage && <Category />}
                    <main>
                        <ScrollToTop />
                        <Routes>
                            <Route path="/" element={<><ProductList /><Tintuc /><KhuyenMai /><GiaoHangBaoHanh /></>} />
                            <Route path="/loai/:id_loai" element={<ProductList />} />
                            <Route path="/chitiet/:id" element={<ChiTiet />} />
                            <Route path="/products" element={<ProductPage />} />
                            <Route path="/sptrongloai/:id_loai" element={<SPTrongLoai />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/post/:id" element={<BlogDetail />} />
                            <Route path="/dangki" element={<DangKi />} />
                            <Route path="/giohang/:id_user" element={<GioHang />} />
                            <Route path="/orders/:id" element={<ChiTietDH />} />
                            <Route path="/checkout" element={<CheckoutNow />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/lienhe" element={<ContactForm />} />
                            <Route path="/reset-password/:token" element={<ResetPassword />} />
                            <Route path="/dangnhap" element={<Login />} />
                            <Route path="/payment-result" element={<PaymentResultPage />} />

                        </Routes>
                    </main>
                    {showChat && <ChatBox />}
                    <Footer />
                </>
            )}
        </div>
    );
};

export default App;
