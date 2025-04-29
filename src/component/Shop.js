import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ShopPage.css";

const ProductCard = ({ item, onClick, addToCart }) => (
  <div className="shop-item">
    <div className="shop-image-container" onClick={onClick}>
      <img src={item.image} alt={item.name} className="shop-image" />
    </div>
    <div className="shop-info">
      <h3 className="shop-name">{item.name}</h3>
      <div className="shop-prices">
        {item.price_km ? (
          <>
            <p className="shop-price shop-price-original">{item.price?.toLocaleString()}₫</p>
            <p className="shop-price shop-price-sale">{item.price_km?.toLocaleString()}₫</p>
          </>
        ) : (
          <p className="shop-price">{item.price?.toLocaleString()}₫</p>
        )}
      </div>
      <button className="add-to-cart-button" onClick={() => addToCart(item)}>🛒 Thêm vào giỏ</button>
    </div>
  </div>
);

const ShopPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", price: "all", category: "all", sort: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/danhmuc")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        const allProducts = data.flatMap(category => category.san_pham.map(sp => ({
          id: sp.id,
          name: sp.ten_sp,
          price: sp.gia_goc || 0,
          price_km: sp.gia_khuyen_mai || 0,
          category: category.ten_loai,
          image: sp.hinh || "default.jpg",
          luot_xem: sp.luot_xem || 0, // Giả sử bạn có thuộc tính views trong dữ liệu

        })));
        setProducts(allProducts);
        setFeaturedProducts(allProducts.filter(item => item.luot_xem > 0).sort((a, b) => b.luọt_xem - a.luọt_xem));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh mục và sản phẩm:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => setCurrentPage(1), [filters]);

  const filteredProducts = useMemo(() => products
    .filter((item) => item.name.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((item) => filters.category === "all" || item.category === filters.category)
    .filter((item) => {
      const price = Number(item.price) || 0;
      return filters.price === "all" || (filters.price === "under2m" && price < 2000000) ||
             (filters.price === "2m-3m" && price >= 2000000 && price <= 3000000) ||
             (filters.price === "above3m" && price > 3000000);
    })
    .sort((a, b) => filters.sort.includes("price")
      ? filters.sort === "price-asc" ? a.price - b.price : b.price - a.price
      : filters.sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    ), [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const sortedFeaturedProducts = useMemo(() => {
    return [...featuredProducts].sort((a, b) => b.luot_xem - a.luot_xem);
  }, [featuredProducts]);


  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="shop-container">
      {/* Sidebar chứa Bộ lọc + Sản phẩm nổi bật */}
<div className="shop-sidebar">
  <h3 className="filter-title">Bộ lọc sản phẩm</h3>
  <input
    type="text"
    placeholder="Tìm kiếm sản phẩm..."
    value={filters.search}
    className="search-input-2"
    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
  />
  <label className="filter-label">Danh mục:</label>
  <select value={filters.category} className="filter-select" onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
    <option value="all">Tất cả</option>
    {categories.map((cat) => <option key={cat.id} value={cat.ten_loai}>{cat.ten_loai}</option>)}
  </select>
  <label className="filter-label">Khoảng giá:</label>
  <select value={filters.price} className="filter-select" onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
    <option value="all">Tất cả</option>
    <option value="under2m">Dưới 2 triệu</option>
    <option value="2m-3m">2 - 3 triệu</option>
    <option value="above3m">Trên 3 triệu</option>
  </select>
  <label className="filter-label">Sắp xếp:</label>
  <select value={filters.sort} className="filter-select" onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
    <option value="asc">Tên A - Z</option>
    <option value="desc">Tên Z - A</option>
    <option value="price-asc">Giá thấp - cao</option>
    <option value="price-desc">Giá cao - thấp</option>
  </select>
  <button className="reset-filter-button" onClick={() => setFilters({ search: "", price: "all", category: "all", sort: "asc" })}>
    Xóa tất cả bộ lọc
  </button>

  {/* Phần sản phẩm nổi bật (Nằm trong sidebar) */}
  <h3 className="featured-title">Sản phẩm nổi bật</h3>
  <div className="featured-products">
    {sortedFeaturedProducts.length ? (
      <div className="featured-products-wrapper">
        {sortedFeaturedProducts.slice(0, 5).map((item) => ( // Giới hạn 3 sản phẩm để không quá dài
          <ProductCard 
            key={item.id} 
            item={item} 
            onClick={() => navigate(`/chitiet/${item.id}`)} 
            showButton={false} // Ẩn nút "Thêm vào giỏ hàng" trong sidebar
          />
        ))}
      </div>
    ) : (
      <p className="no-products-text">Không có sản phẩm nổi bật!</p>
    )}
  </div>
</div>



      <div className="shop-main">
        {loading ? (
          <p className="loading-text">Đang tải sản phẩm...</p>
        ) : (
          <>
     
            <h2 className="products-title">Tất cả sản phẩm</h2>
            {paginatedProducts.length ? (
              <div className="shop-grid">
                {paginatedProducts.map((item) => 
                  <ProductCard key={item.id} item={item} onClick={() => navigate(`/chitiet/${item.id}`)} addToCart={addToCart} />
                )}
              </div>
            ) : <p className="no-products-text">Không tìm thấy sản phẩm nào!</p>}

            
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Trước</button>
              {[...Array(totalPages).keys()].map(num => (
                <button key={num + 1} className={`pagination-button ${currentPage === num + 1 ? "active" : ""}`} onClick={() => setCurrentPage(num + 1)}>{num + 1}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Tiếp</button>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default ShopPage;