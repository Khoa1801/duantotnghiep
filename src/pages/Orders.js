import React, { useState, useEffect } from "react";
import '../css/OrderDetails.css';  // Import file CSS

const OrderDetails = ({ orderId }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/orders2`);
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu");
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(err.message);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [orderId]);

  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:3000/order/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Không thể xóa đơn hàng");
      }
      setOrders(orders.filter((order) => order.id_dh !== orderId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${updatedOrder.id_dh}/details/${updatedOrder.id_ct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: updatedOrder.quantity,
          price: updatedOrder.price,
          size: updatedOrder.size,
          color: updatedOrder.color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật chi tiết đơn hàng");
      }

      const updatedOrderFromResponse = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id_dh === updatedOrder.id_dh
            ? {
                ...order,
                don_hang_chi_tiet: order.don_hang_chi_tiet.map((detail) =>
                  detail.id_ct === updatedOrder.id_ct
                    ? { ...detail, ...updatedOrderFromResponse }
                    : detail
                ),
              }
            : order
        )
      );

      setEditingOrder(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="order-details-container12">
      <h2 className="title12">Chi tiết đơn hàng</h2>

      <div className="order-table-container12">
        <table className="order-table12">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Size</th>
              <th>Màu sắc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id_ct}>
                  <td>{order.id_dh || "N/A"}</td>
                  <td>{order.product_name || "Chưa có tên sản phẩm"}</td>
                  <td>{order.quantity || "N/A"}</td>
                  <td>{order.price ? `${order.price}đ` : "N/A"}</td>
                  <td>{order.size || "N/A"}</td>
                  <td>{order.color || "N/A"}</td>
                  <td>
                    <button onClick={() => handleEditOrder(order)} className="edit-btn12">Sửa</button>
                    <button onClick={() => handleDeleteOrder(order.id_dh)} className="delete-btn12">Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-orders12">Không có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingOrder && (
        <div className="modal-overlay12">
          <div className="modal-content12">
            <h3>Chỉnh sửa đơn hàng</h3>
            <div>
              <label>Mã đơn:</label>
              <input type="text" value={editingOrder.id_dh} readOnly />
            </div>
            <div>
              <label>Sản phẩm:</label>
              <input
                type="text"
                value={editingOrder.product_name}
                onChange={(e) => setEditingOrder({ ...editingOrder, product_name: e.target.value })}
              />
            </div>
            <div>
              <label>Số lượng:</label>
              <input
                type="number"
                value={editingOrder.quantity}
                onChange={(e) => setEditingOrder({ ...editingOrder, quantity: e.target.value })}
              />
            </div>
            <div>
              <label>Giá:</label>
              <input
                type="number"
                value={editingOrder.price}
                onChange={(e) => setEditingOrder({ ...editingOrder, price: e.target.value })}
              />
            </div>
            <div>
              <label>Kích cỡ:</label>
              <input
                type="text"
                value={editingOrder.size || ""}
                onChange={(e) => setEditingOrder({ ...editingOrder, size: e.target.value })}
              />
            </div>
            <div>
              <label>Màu sắc:</label>
              <input
                type="text"
                value={editingOrder.color || ""}
                onChange={(e) => setEditingOrder({ ...editingOrder, color: e.target.value })}
              />
            </div>
            <button onClick={() => handleUpdateOrder(editingOrder)} className="save-btn12">Lưu</button>
            <button onClick={() => setEditingOrder(null)} className="cancel-btn12">Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
