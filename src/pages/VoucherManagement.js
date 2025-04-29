import React, { useEffect, useState } from "react";
import "../css/voucher.css";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVoucherId, setCurrentVoucherId] = useState(null);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    discount_amount: "",
    status: "active",
    start_date: "",
    expiry_date: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/vouchers")
      .then((response) => response.json())
      .then((data) => {
        setVouchers(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
      try {
        const response = await fetch(`http://localhost:3000/vouchers/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setVouchers((prev) => prev.filter((voucher) => voucher.id !== id));
          alert("Xóa voucher thành công!");
        } else {
          alert("Xóa voucher thất bại!");
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  const handleChange = (e) => {
    setNewVoucher({ ...newVoucher, [e.target.name]: e.target.value });
  };

  const handleEdit = (voucher) => {
    setIsEditing(true);
    setShowForm(true);
    setCurrentVoucherId(voucher.id);
    setNewVoucher(voucher);
  };

  const handleSubmit = async () => {
    if (!newVoucher.code || !newVoucher.discount_amount) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(
        isEditing
          ? `http://localhost:3000/vouchers/${currentVoucherId}`
          : "http://localhost:3000/vouchers",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVoucher),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setVouchers((prev) =>
          isEditing
            ? prev.map((voucher) =>
                voucher.id === currentVoucherId ? { ...voucher, ...newVoucher } : voucher
              )
            : [...prev, result]
        );
        alert(`${isEditing ? "Cập nhật" : "Thêm"} voucher thành công!`);
      } else {
        alert(`${isEditing ? "Cập nhật" : "Thêm"} voucher thất bại!`);
      }
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }

    setShowForm(false);
    setIsEditing(false);
    setNewVoucher({ code: "", discount_amount: "", status: "active", start_date: "", expiry_date: "" });
  };

  return (
    <div className="voucher-management14">
      <h2 className="voucher-title14">Quản lý Voucher</h2>
      <div className="voucher-table-container14">
        <table className="voucher-table14">
          <thead>
            <tr>
              <th>Mã voucher</th>
              <th>Giảm giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td>{voucher.code}</td>
                <td>{voucher.discount_amount}</td>
                <td>{voucher.status === "active" ? "Đang hoạt động" : "Hết hiệu lực"}</td>
                <td className="action-buttons14">
                  <button className="action-button14" onClick={() => handleEdit(voucher)}>Chỉnh sửa</button>
                  <button className="action-button141" onClick={() => handleDelete(voucher.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowForm(true)} className="add-button14">
          {isEditing ? "Chỉnh sửa Voucher" : "Thêm Voucher"}
        </button>
        {showForm && (
          <div className="voucher-form14">
            <h3>{isEditing ? "Chỉnh sửa Voucher" : "Thêm Voucher"}</h3>
            <input
              type="text"
              name="code"
              value={newVoucher.code}
              onChange={handleChange}
              placeholder="Mã voucher"
              className="form-input14"
            />
            <input
              type="number"
              name="discount_amount"
              value={newVoucher.discount_amount}
              onChange={handleChange}
              placeholder="Giảm giá"
              className="form-input14"
            />
            <input
              type="date"
              name="start_date"
              value={newVoucher.start_date}
              onChange={handleChange}
              placeholder="Ngày bắt đầu"
              className="form-input14"
            />
            <input
              type="date"
              name="expiry_date"
              value={newVoucher.expiry_date}
              onChange={handleChange}
              placeholder="Ngày hết hạn"
              className="form-input14"
            />
            <button onClick={handleSubmit} className="submit-button14">
              {isEditing ? "Cập nhật" : "Xác nhận"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherManagement;
