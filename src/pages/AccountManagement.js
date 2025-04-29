import React, { useEffect, useState } from "react";
import "../css/user.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [showForm, setShowForm] = useState(false); // 👈 thêm state để điều khiển form

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editUserId ? "PUT" : "POST";
    const url = editUserId
      ? `http://localhost:3000/users/${editUserId}`
      : "http://localhost:3000/users";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      fetchUsers();
      setFormData({
        full_name: "",
        address: "",
        phone: "",
        email: "",
        password: "",
        role: "",
      });
      setEditUserId(null);
      setShowForm(false); // 👈 ẩn form sau khi thêm/cập nhật
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật người dùng:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditUserId(user.id);
    setShowForm(true); // 👈 hiện form khi sửa
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await fetch(`http://localhost:3000/users/${id}`, { method: "DELETE" });
        fetchUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="user-management-container">
      <h2 className="section-heading">Quản lý Người Dùng</h2>

      {/* Nút hiển thị form */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="add-user-btn">
          Thêm người dùng
        </button>
      )}

      {/* Form thêm/sửa người dùng */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type={key === "password" ? "password" : "text"}
              placeholder={key.replace("_", " ").toUpperCase()}
              value={formData[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="form-input"
            />
          ))}
          <div className="form-actions">
            <button type="submit" className="submit-btn1">
              {editUserId ? "Cập nhật" : "Thêm"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  full_name: "",
                  address: "",
                  phone: "",
                  email: "",
                  password: "",
                  role: "",
                });
                setEditUserId(null);
              }}
              className="cancel-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Bảng danh sách người dùng */}
      <table className="user-table">
        <thead>
          <tr className="table-header">
            {["Tên", "Địa chỉ", "SĐT", "Email", "Vai trò", "Hành động"].map(
              (header) => (
                <th key={header}>{header}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="table-row">
              <td>{user.full_name}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="action-buttons">
                <button onClick={() => handleEdit(user)} className="edit-btn">
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="delete-btn"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
