import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBox, FaShippingFast, FaMoneyBillWave } from "react-icons/fa";
import "../css/ChiTietDH.css";  // Import file CSS

const ChiTietDH = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [total, setTotal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/order/total/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không thể lấy tổng tiền đơn hàng");
        }
        return res.json();
      })
      .then((data) => {
        setTotal(data.tong_tien);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/orders/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tải đơn hàng");
        }
        return res.json();
      })
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Không tìm thấy đơn hàng");
        }
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  

  if (loading) return <div className="text-center text-gray-500 mt-5">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 mt-5">{error}</div>;
  if (!order) return <div className="text-center text-red-500 mt-5">Không tìm thấy đơn hàng!</div>;

  return (
    <div className="chi-tiet-dh-container">
      <h2 className="chi-tiet-dh-header">
        Chi tiết đơn hàng #{order.id_dh || "N/A"}
      </h2>

      <div className="chi-tiet-dh-info">
        <p><strong>Khách hàng:</strong> {order.ho_ten || "N/A"}</p>
        <p><strong>Số điện thoại:</strong> {order.sdt || "N/A"}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {order.address || "N/A"}</p>
      </div>

      <div className="trang-thai-container">
        <h3 className="trang-thai-title">
          <FaBox /> Trạng thái đơn hàng
        </h3>
        <p className={`trang-thai 
          ${order.trang_thai === "Đã giao hàng" ? "da-giao" : 
          order.trang_thai === "Đang giao" ? "dang-giao" : "chua-cap-nhat"}`}>
          {order.trang_thai || "Chưa cập nhật"}
        </p>
      </div>

      <div className="tong-gia-container">
  <h3 className="tong-gia-title">
    <FaMoneyBillWave /> Tổng giá trị đơn hàng
  </h3>
<p className="tong-gia">
          {total !== null ? total.toLocaleString("vi-VN") : "0"} VNĐ
        </p>
</div>

      <div className="danh-sach-san-pham">
        <h3 className="tong-gia-title">
          <FaShippingFast /> Danh sách sản phẩm
        </h3>
        <ul>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <li key={index} className="san-pham-item">
                <img src={item.hinh || "/default-image.jpg"} alt={item.hinh} className="san-pham-img" />
                <span className="san-pham-name">{item.product} (SL: {item.so_luong})</span>
                <span className="san-pham-price">Giá: {Number(item.gia_goc).toLocaleString('vi-VN')} VNĐ</span>
                <span className="san-pham-price">Tổng: {(item.gia_goc * item.so_luong).toLocaleString('vi-VN')} VNĐ</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChiTietDH;
