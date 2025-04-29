import React, { useEffect, useState } from "react";
import "../css/order.css"; // Đường dẫn file CSS thuần của bạn

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/order")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const updatedOrders = data.map((order) => {
            if (order.trang_thai === "dang_xu_ly") {
              const now = new Date();
              const updatedAt = new Date(order.ngay_cap_nhat);
              const diffInSeconds = (now - updatedAt) / 1000;

              if (diffInSeconds >= 10) {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id_dh === order.id_dh && o.trang_thai === "dang_xu_ly"
                      ? { ...o, trang_thai: "da_giao" }
                      : o
                  )
                );
                updateOrderStatus(order.id_dh, "da_giao");
              }
            }
            return order;
          });

          setOrders(updatedOrders);
        } else {
          console.error("Dữ liệu không hợp lệ:", data);
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
        setLoading(false);
      });
  }, []);

  const updateOrderStatus = async (id_dh, newStatus) => {
    try {
      await fetch(`http://localhost:3000/order/${id_dh}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trang_thai: newStatus }),
      });
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái đơn hàng ${id_dh}:`, error);
    }
  };

  const handleConfirmOrder = async (id_dh) => {
    try {
      const res = await fetch(`http://localhost:3000/order/${id_dh}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trang_thai: "dang_xu_ly" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Cập nhật trạng thái thất bại");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id_dh === id_dh ? { ...o, trang_thai: "dang_xu_ly" } : o
        )
      );
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
    }
  };

  const handleDeleteOrder = async (id_dh) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) return;

    try {
      const res = await fetch(`http://localhost:3000/order/${id_dh}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xóa đơn hàng thất bại");

      setOrders((prev) => prev.filter((o) => o.id_dh !== id_dh));
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error.message);
    }
  };

  const filteredOrders = orders.filter((order) =>
    activeTab === "pending"
      ? order.trang_thai === "cho_xu_ly"
      : activeTab === "processing"
      ? order.trang_thai === "dang_xu_ly"
      : activeTab === "delivering"
      ? order.trang_thai === "da_giao"
      : order.trang_thai === "da_huy"
  );

  return (
    <div className="order-page l1">
      <h2 className="title l1">Quản lý đơn hàng</h2>

      <div className="tab-buttons l1">
        {["pending", "processing", "delivering", "cancelled"].map((tab) => (
          <button
            key={tab}
            className={`tab-button l1 ${activeTab === tab ? "active l1" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {{
              pending: "Chờ xử lý",
              processing: "Đang xử lý",
              delivering: "Đã giao",
              cancelled: "Đã hủy",
            }[tab]}
          </button>
        ))}
      </div>

      <div className="order-table l1">
        <table>
          <thead>
            <tr>
              <th className="l1">Mã đơn</th>
              <th className="l1">Khách hàng</th>
              <th className="l1">Tổng tiền</th>
              <th className="l1">Trạng thái</th>
              <th className="l1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id_dh}>
                  <td className="l1">{order.id_dh}</td>
                  <td className="l1">{order.ho_ten}</td>
                  <td className="l1">{order.tong_tien}đ</td>
                  <td className={`status l1 ${order.trang_thai}`}>
                    {order.trang_thai}
                  </td>
                  <td className="action-buttons l1">
                    {order.trang_thai === "cho_xu_ly" && (
                      <button onClick={() => handleConfirmOrder(order.id_dh)} className="btn confirm l1">Xác nhận</button>
                    )}
                    <button onClick={() => handleDeleteOrder(order.id_dh)} className="btn delete l1">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-order l1">Không có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="modal-overlay l1">
          <div className="order-modal l1">
            <h3 className="l1">Chi tiết đơn hàng</h3>
            <p className="l1"><strong>Mã đơn:</strong> {selectedOrder.id_dh}</p>
            <p className="l1"><strong>Khách hàng:</strong> {selectedOrder.ho_ten}</p>
            <p className="l1"><strong>Tổng tiền:</strong> {selectedOrder.tong_tien}đ</p>
            <p className="l1"><strong>Trạng thái:</strong> {selectedOrder.trang_thai}</p>
            <p className="l1"><strong>Ngày tạo:</strong> {selectedOrder.updated_at}</p>
            <p className="l1"><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
            <p className="l1"><strong>Số điện thoại:</strong> {selectedOrder.sdt}</p>
            <button className="btn close l1" onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
