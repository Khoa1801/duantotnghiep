import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProductList.css";
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";

function ProductList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [cartItems, setCartItems] = useState([]);
    const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;

  useEffect(() => {
    fetch("http://localhost:3000/danhmuc")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setError("Dữ liệu không hợp lệ");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể kết nối đến máy chủ.");
        setLoading(false);
      });
  }, []);

  const handleNavigateToCheckout = (product) => {
    navigate("/checkout", { state: { product } });
  };// Khi nhấn nút "Thêm vào giỏ"
  const handleAddToCartClick = async (product) => {
    try {
      const res = await axios.get(`http://localhost:3000/sanpham/${product.id}`);
      const fetchedProduct = res.data;
  
      const colors = fetchedProduct.mau_sac
        ? fetchedProduct.mau_sac.split(",").map((c) => c.trim())
        : [];
      const sizes = fetchedProduct.size
        ? fetchedProduct.size.split(",").map((s) => s.trim())
        : [];
  
      setSelectedProduct({
        ...fetchedProduct,
        gia_khuyen_mai: product.gia_khuyen_mai, // lấy thêm giá từ list
        hinh: product.hinh, // lấy thêm hình
        colors,
        sizes,
      });
      setShowOptions(true);
    } catch (error) {
      toast.error("Không lấy được thông tin sản phẩm.");
    }
  };
  
  
  
    const handleConfirmAddToCart = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return toast.error("❗ Vui lòng đăng nhập!");
    
      if (!selectedColor || !selectedSize) {
        return toast.warning("⚠️ Chọn đủ màu và size!");
      }
    
      if (!selectedProduct || !selectedProduct.id) {
        return toast.error("❗ Không có thông tin sản phẩm.");
      }
    
      const cartItem = {
        id_user: user.id,
        id_sp: selectedProduct.id,
        tensp: selectedProduct.ten_sp,
        gia: selectedProduct.gia_khuyen_mai,
        img: selectedProduct.hinh,
        so_luong: 1,
        color: selectedColor,
        size: selectedSize,
      };
    
      try {
        const res = await fetch(`http://localhost:3000/giohang`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cartItem),
        });
    
        if (!res.ok) throw new Error();
    
        toast.success("🛒 Đã thêm vào giỏ!");
        setCartItems((prev) => [...prev, cartItem]);
        setShowOptions(false);
        setSelectedColor("");
        setSelectedSize("");
      } catch {
        toast.error("❌ Lỗi khi thêm giỏ hàng!");
      }
    };
    
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="product-container">
      {categories.map((category) => (
        <article key={category.id} className="category-wrapper">
          <h2 className="category-title">{category.ten_loai}</h2>
          <div className="products-grid">
            {category.san_pham.length > 0 ? (
              category.san_pham.slice(0, 4).map((product) => (
                <div key={product.id} className="product-item">
                  <Link to={`/chitiet/${product.id}`} className="product-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <img src={product.hinh} alt={product.ten_sp} className="product-image" />
                    <h4 className="product-name">{product.ten_sp}</h4>
                  </Link>
                  <p className="product-price">
                    {product.gia_goc && (
                      <span className="product-sale-price">
                        {Number(product.gia_goc).toLocaleString("vi")} VNĐ
                      </span>
                    )}
                    <span className="product-final-price">
                      {Number(product.gia_khuyen_mai).toLocaleString("vi")} VNĐ
                    </span>
                  </p>
                  <div className="button-group">
                    <button className="buy-button" onClick={() => handleNavigateToCheckout(product)}>
                      Mua ngay
                    </button>
                    <button className="cart-button" onClick={() => handleAddToCartClick(product)}>
                      Thêm Giỏ Hàng
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">Không có sản phẩm.</p>
            )}
          </div>
        </article>
      ))}

    {/* Modal chọn màu & size */}
{showOptions && selectedProduct && (
  <div className="overlay">
    <div className="option-modal">
      <h3>Chọn màu sắc và kích thước</h3>
      <p><strong>Sản phẩm:</strong> {selectedProduct.ten_sp}</p>

      <div className="option-group">
        <label>Màu sắc:</label>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <option value="">-- Chọn màu --</option>
          {selectedProduct.colors && selectedProduct.colors.length > 0 ? (
            selectedProduct.colors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))
          ) : (
            <option disabled>Không có màu sắc</option>
          )}
        </select>
      </div>

      <div className="option-group">
        <label>Kích thước:</label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="">-- Chọn size --</option>
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
            selectedProduct.sizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))
          ) : (
            <option disabled>Không có size</option>
          )}
        </select>
      </div>

      <div className="option-buttons">
        <button
          className="confirm-btn"
          onClick={handleConfirmAddToCart}
          disabled={!selectedColor || !selectedSize}
        >
          Xác nhận
        </button>
        <button className="cancel-btn-2" onClick={() => setShowOptions(false)}>
          Hủy
        </button>
      </div>
    </div>
  </div>
)}


    </section>
  );
}

export default ProductList;
