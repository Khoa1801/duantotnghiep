import React, { useState } from "react";
import "../css/products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Vui lòng nhập tên và giá sản phẩm.");
      return;
    }
    const id = Date.now(); // ID tạm
    setProducts([...products, { id, ...newProduct }]);
    setNewProduct({ name: "", price: "", image: "" });
    setShowForm(false);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-heading">🛒 Danh sách sản phẩm</h2>
        <button
          className="add-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✖ Hủy" : "➕ Thêm sản phẩm"}
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Giá"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Ảnh URL (tuỳ chọn)"
            value={newProduct.image}
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.value })
            }
          />
          <button className="save-btn" onClick={handleAddProduct}>
            Lưu
          </button>
        </div>
      )}

      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.name}
              className="product-img"
            />
            <h3>{product.name}</h3>
            <p>Giá: {product.price}₫</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
