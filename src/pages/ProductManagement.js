import React, { useEffect, useState } from "react";
import "../css/ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProduct] = useState({
    ten_sp: "",
    slug: "",
    gia_goc: "",
    gia_khuyen_mai: "",
    so_luong: "",
    id_loai: "",
    ngay: "",
    hinh: "",
    hot: "",
    luot_xem: "",
    an_hien: "",
    tinh_chat: "",
    mo_ta: "",
    mau_sac: "",
    size: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProduct({
      ten_sp: "",
      slug: "",
      gia_goc: "",
      gia_khuyen_mai: "",
      so_luong: "",
      id_loai: "",
      ngay: "",
      hinh: "",
      hot: "",
      luot_xem: "",
      an_hien: "",
      tinh_chat: "",
      mo_ta: "",
      mau_sac: "",
      size: "",
    });
    setEditProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editProductId ? "PUT" : "POST";
    const url = editProductId
      ? `http://localhost:3000/products/${editProductId}`
      : "http://localhost:3000/products";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật sản phẩm:", error);
    }
  };

  const handleEdit = (product) => {
    setProduct(product);
    setEditProductId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa sản phẩm này?")) return;
    try {
      await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  if (loading) return <div className="loading1">Đang tải dữ liệu...</div>;

  return (
    <div className="product-management1">
      <div className="header1">
        <h2>Quản lý sản phẩm</h2>
        <button className="btn-add1" onClick={() => { setShowForm(true); resetForm(); }}>
          + Thêm sản phẩm
        </button>
      </div>

      <div className="table-container1">
        <table className="product-table1">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Hình</th>
              <th>Giá gốc</th>
              <th>Giá KM</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} onClick={() => setSelectedProduct(prod)}>
                <td>{prod.ten_sp}</td>
                <td><img src={prod.hinh} alt={prod.ten_sp} width={50} height={50} /></td>
                <td>{prod.gia_goc}</td>
                <td>{prod.gia_khuyen_mai}</td>
                <td>{prod.so_luong}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(prod); }} className="btn-edit1">Sửa</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(prod.id); }} className="btn-delete1">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="modal1">
          <div className="modal-content1">
            <div className="modal-header1">
              <h4>{editProductId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</h4>
              <button onClick={() => setShowForm(false)} className="close-btn1">&times;</button>
            </div>
            <form className="product-form1" onSubmit={handleSubmit}>
              {["ten_sp", "slug", "gia_goc", "gia_khuyen_mai", "so_luong", "hinh", "mau_sac", "size"].map((field) => (
                <div className="form-group1" key={field}>
                  <label htmlFor={field}>{field}</label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={product[field]}
                    onChange={(e) => setProduct({ ...product, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div className="form-actions1">
                <button type="submit" className="btn-submit1">Lưu</button>
                <button type="button" className="btn-cancel1" onClick={() => setShowForm(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL */}
      {selectedProduct && (
        <div className="modal1" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header1">
              <h4>Chi tiết sản phẩm</h4>
              <button className="close-btn1" onClick={() => setSelectedProduct(null)}>&times;</button>
            </div>
            <div className="product-detail1">
              <p><strong>Tên:</strong> {selectedProduct.ten_sp}</p>
              <p><strong>Slug:</strong> {selectedProduct.slug}</p>
              <p><strong>Giá gốc:</strong> {selectedProduct.gia_goc}</p>
              <p><strong>Giá KM:</strong> {selectedProduct.gia_khuyen_mai}</p>
              <p><strong>Số lượng:</strong> {selectedProduct.so_luong}</p>
              <p><strong>Màu sắc:</strong> {selectedProduct.mau_sac}</p>
              <p><strong>Size:</strong> {selectedProduct.size}</p>
              <img src={selectedProduct.hinh} alt={selectedProduct.ten_sp} className="product-image1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
