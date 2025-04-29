import React, { useState, useEffect } from "react";
import "../css/Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Cập nhật thất bại");

      localStorage.setItem("user", JSON.stringify(userData));
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật thông tin");
    }
  };

  return (
    <div className="profile-container">
      <h2>Chỉnh sửa thông tin cá nhân</h2>
      <label>Họ và Tên:</label>
      <input type="text" name="full_name" value={userData.full_name} onChange={handleChange} />

      <label>Số điện thoại:</label>
      <input type="text" name="phone" value={userData.phone} onChange={handleChange} />

      <label>Địa chỉ:</label>
      <input type="text" name="address" value={userData.address} onChange={handleChange} />

      <button className="save-button" onClick={handleSave}>Lưu thay đổi</button>
    </div>
  );
};

export default Profile;
