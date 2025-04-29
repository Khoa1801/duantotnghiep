import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom"; 
import "./css/App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChiTiet from "./component/chitiet";
import Header from "./component/Header";
import Profile from "./component/Profile";
import Settings from "./component/Settings";
import ScrollToTop from "./component/ScrollToTop";
import Banner from "./component/Banner";
import Category from "./component/Category";
import ProductList from "./component/ProductList";
import Tintuc from "./component/Tintuc";
import CheckoutNow from "./component/MuaNgay";
import ProductPage from "./component/Shop";
import Footer from "./component/Footer";
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
// import AdminApp from "../shoe-store-admin/src/App"; // Import Admin App

const AppContent = () => {
    const location = useLocation();
    const role = JSON.parse(localStorage.getItem("user"))?.role;  // Lấy thông tin role từ localStorage
    const navigate = useNavigate();
    const isHomePage = location.pathname === "/";
    const hideChatOnPages = ["/checkout", "/blog"];
    const showChat = !hideChatOnPages.includes(location.pathname);

    useEffect(() => {
        // Lấy dữ liệu từ URL sau khi đăng nhập qua Facebook
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const userName = urlParams.get('userName');

        if (userId && userName) {
            const user = { id: userId, name: userName };
            localStorage.setItem('user', JSON.stringify(user));

            // Xóa thông tin trên URL
            window.history.replaceState({}, document.title, "/");

            // Chuyển hướng về trang chủ
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="app-container">
            <ToastContainer />
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
                    
                    <Route path="/admin/*" element={<Navigate to="/" />} />

                </Routes>
            </main>
            {showChat && <ChatBox />}
            <Footer />
        </div>
    );
};

export default AppContent;
