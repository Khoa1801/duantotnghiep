import React from "react";
import { FaShippingFast, FaShieldAlt, FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import "../css/ExtraInfo.css";

const GiaoHangBaoHanh = () => {
    return (
        <div className="giao-hang-container">
            <h2 className="giao-hang-title">Chính Sách Dịch Vụ</h2>
            <div className="giao-hang-list">
                <div className="giao-hang-item">
                    <FaShippingFast className="giao-hang-icon" />
                    <div>
                        <h3>Giao hàng nhanh</h3>
                        <p>Nhận hàng trong 24h tại các thành phố lớn.</p>
                    </div>
                </div>
                <div className="giao-hang-item">
                    <FaTruck className="giao-hang-icon" />
                    <div>
                        <h3>Miễn phí vận chuyển</h3>
                        <p>Đơn hàng từ 1 triệu VNĐ được freeship toàn quốc.</p>
                    </div>
                </div>
                <div className="giao-hang-item">
                    <FaShieldAlt className="giao-hang-icon" />
                    <div>
                        <h3>Bảo hành chính hãng</h3>
                        <p>Hỗ trợ đổi trả trong 30 ngày nếu lỗi từ nhà sản xuất.</p>
                    </div>
                </div>
                
                <div className="giao-hang-item">
                    <FaHeadset className="giao-hang-icon" />
                    <div>
                        <h3>Hỗ trợ khách hàng 24/7</h3>
                        <p>Đội ngũ CSKH sẵn sàng hỗ trợ bất cứ lúc nào.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiaoHangBaoHanh;
