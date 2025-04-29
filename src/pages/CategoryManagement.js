import React, { useEffect, useState } from "react";
import "../css/CategoryManagement.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ten_loai: "",
    slug: "",
    thu_tu: "",
    mo_ta: "",
    hinh_anh: "",
    parent_id: "",
    an_hien: "1",
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch("http://localhost:3000/danhmuc")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Lỗi khi tải danh mục: " + error.message);
        setLoading(false);
      });
  };

  const fetchProductsByCategory = (categoryId) => {
    fetch(`http://localhost:3000/danhmuc/${categoryId}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.san_pham || []);
      })
      .catch((error) =>
        setError("Lỗi khi tải sản phẩm: " + error.message)
      );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addCategory = () => {
    fetch("http://localhost:3000/loai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => {
        setFormData({
          ten_loai: "",
          slug: "",
          thu_tu: "",
          mo_ta: "",
          hinh_anh: "",
          parent_id: "",
          an_hien: "1",
        });
        setShowModal(false);
        fetchCategories();
      })
      .catch((error) =>
        setError("Lỗi khi thêm danh mục: " + error.message)
      );
  };

  const deleteCategory = (id) => {
    fetch(`http://localhost:3000/loai/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchCategories())
      .catch((error) =>
        setError("Lỗi khi xóa danh mục: " + error.message)
      );
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditName(category.ten_loai);
  };

  const updateCategory = (id) => {
    fetch(`http://localhost:3000/loai/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ten_loai: editName }),
    })
      .then(() => {
        setEditingCategory(null);
        setEditName("");
        fetchCategories();
      })
      .catch((error) =>
        setError("Lỗi khi cập nhật danh mục: " + error.message)
      );
  };

  const toggleCategory = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setProducts([]);
    } else {
      setExpandedCategory(categoryId);
      fetchProductsByCategory(categoryId);
    }
  };

  if (loading) return <div className="loadingll">Đang tải danh mục...</div>;
  if (error) return <div className="errorll">{error}</div>;

  return (
    <div className="category-container-2ll">
      <div className="category-headerll">
        <h2>Quản lý danh mục</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-addll">
          ➕ Thêm danh mục
        </button>
      </div>

      <div className="category-table-wrapperll">
        <table className="category-tablell">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="category-namell">
                  {editingCategory === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    <span>{cat.ten_loai}</span>
                  )}
                  <span
                    className="toggle-iconll"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    {expandedCategory === cat.id ? "🔼" : "🔽"}
                  </span>
                </td>
                <td>
                  {editingCategory === cat.id ? (
                    <button
                      onClick={() => updateCategory(cat.id)}
                      className="btn btn-savell"
                    >
                      Lưu
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(cat)}
                      className="icon-btn editll"
                    >
                       Sửa
                    </button>
                  )}
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="icon-btn deletell"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expandedCategory && products.length > 0 && (
        <div className="product-listll">
          <h3>Sản phẩm trong danh mục:</h3>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <img src={product.hinh} alt={product.ten_sp} />
                <span>
                  {product.ten_sp} - {product.gia_goc} VND
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModal && (
        <div className="modal-overlayll">
          <div className="modalll">
            <h3>Thêm danh mục</h3>
            {Object.keys(formData).map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                placeholder={field.replace("_", " ")}
              />
            ))}
            <div className="modal-actionll">
              <button onClick={() => setShowModal(false)} className="btn btn-cancelll">
                ❌ Đóng
              </button>
              <button onClick={addCategory} className="btn btn-addll">
                ➕ Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
