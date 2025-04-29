// import React, { useEffect, useState } from "react";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import "../css/Product.css";

// const Product = ({ id }) => {
//     const [product, setProduct] = useState(null);
//     const [isWishlist, setIsWishlist] = useState(false);
//     const placeholderImage = "/placeholder.jpg"; // Hình ảnh mặc định nếu API lỗi

//     const toggleWishlist = () => setIsWishlist(!isWishlist);

//     useEffect(() => {
//         if (!id) return;

//         const controller = new AbortController();
//         const signal = controller.signal;

//         fetch(`http://localhost:3000/products/${id}`, { signal })
//             .then((response) => {
//                 if (!response.ok) throw new Error("Lỗi API");
//                 return response.json();
//             })
//             .then((data) => setProduct(data))
//             .catch((error) => {
//                 if (error.name !== "AbortError") {
//                     console.error(`❌ Lỗi API sản phẩm ${id}:`, error);
//                 }
//             });

//         return () => controller.abort(); // Hủy request nếu component unmount
//     }, [id]);

//     if (!product) return <p>Loading...</p>;

//     return (
//         <div className="product-container">
//             <div className="product-image-container">
//                 {product.gia_khuyen_mai < product.gia_goc && (
//                     <span className="discount-badge">
//                         -{Math.round(((product.gia_goc - product.gia_khuyen_mai) / product.gia_goc) * 100)}%
//                     </span>
//                 )}
//                 {product.tinh_chat === "new" && <span className="new-badge">New</span>}
//                 <img className="product-image" src={product.hinh || placeholderImage} alt={product.ten_sp} loading="lazy" />
//                 <button className="wishlist-icon" onClick={toggleWishlist}>
//                     {isWishlist ? <FaHeart className="wishlist-active" /> : <FaRegHeart />}
//                 </button>
//             </div>

//             <div className="product-info">
//                 <h3 className="name">{product.ten_sp}</h3>
//                 <div className="product-pricing">
//                     <span className="price-sale">{product.gia_khuyen_mai.toLocaleString()}đ</span>
//                     {product.gia_goc > product.gia_khuyen_mai && (
//                         <span className="price-original">{product.gia_goc.toLocaleString()}đ</span>
//                     )}
//                 </div>

//                 <div className="product-buttons">
//                     <button className="btn-add-cart">Thêm vào giỏ</button>
//                     <button className="btn-buy-now">Mua ngay</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Product;
