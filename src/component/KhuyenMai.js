import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/KhuyenMai.css";

const KhuyenMai = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ ngay: 0, gio: 0, phut: 0, giay: 0 });

    useEffect(() => {
        const ngayKetThuc = new Date("2025-04-20T23:59:59");

        const tinhThoiGianConLai = () => {
            const khoangCach = ngayKetThuc - new Date();

            if (khoangCach <= 0) {
                return { ngay: 0, gio: 0, phut: 0, giay: 0 };
            }

            return {
                ngay: Math.floor(khoangCach / (1000 * 60 * 60 * 24)),
                gio: Math.floor((khoangCach / (1000 * 60 * 60)) % 24),
                phut: Math.floor((khoangCach / (1000 * 60)) % 60),
                giay: Math.floor((khoangCach / 1000) % 60),
            };
        };

        setTimeLeft(tinhThoiGianConLai());

        const timer = setInterval(() => {
            setTimeLeft(tinhThoiGianConLai());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="khuyenmai-container">
            <div className="khuyenmai-overlay">
                <h2 className="khuyenmai-title">🔥 Ưu Đãi Đặc Biệt Trong Tháng! 🔥</h2>
                <p className="khuyenmai-subtitle">Nhanh tay đặt hàng trước khi hết giờ!</p>

                {timeLeft.ngay === 0 && timeLeft.gio === 0 && timeLeft.phut === 0 && timeLeft.giay === 0 ? (
                    <p className="expired-message">⏳ Khuyến mãi đã kết thúc!</p>
                ) : (
                    <div className="countdown">
                        {Object.entries(timeLeft).map(([unit, value]) => (
                            <div key={unit} className="countdown-box">
                                <span className="countdown-number">{String(value).padStart(2, "0")}</span>
                                <span className="countdown-label">{unit}</span>
                            </div>
                        ))}
                    </div>
                )}

                <button className="sale-button" onClick={() => navigate('/products?discount=true')}>
                    Xem Ngay 🚀
                </button>
            </div>
        </div>
    );
};

export default KhuyenMai;
