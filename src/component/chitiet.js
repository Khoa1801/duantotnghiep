import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useParams, Link } from "react-router-dom";
import "../css/chitiet.css";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [InfoProduct, setInfoProduct] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:3000/binhluan/${id}`);
                const data = await res.json();
                setComments(data);
            } catch (error) {
                console.error("Lỗi khi lấy bình luận:", error);
            }
        }; // <== Hãy kiểm tra dấu này
    
        if (id) {
            fetchComments();
        
    }}, [id]);  // ❌ Sai cú pháp: đóng ngoặc `}` bị thiếu trước `], [productId]);`
    
    useEffect(() => {
        fetch(`http://localhost:3000/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                fetch(`http://localhost:3000/hinh_san_pham/${id}`)
                    .then(res => res.json())
                    .then(imgData => {
                        setImages(imgData.map(img => img.duong_dan));
                        setSelectedImage(imgData.length > 0 ? imgData[0].duong_dan : "/default.jpg");
                    });
                fetch(`http://localhost:3000/products?category=${data.category}`)
                    .then(res => res.json())
                    .then(setRelatedProducts);
                fetch(`http://localhost:3000/thong-tin-san-pham/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            const info = data[0];
                            setInfoProduct(
                                `Màu sắc: ${info.mau_sac} | Kích thước: ${info.kich_thuoc} | Chất liệu: ${info.chat_lieu} | Trọng lượng: ${info.trong_luong} kg`
                            );
                        } else {
                            setInfoProduct("Chưa có thông tin sản phẩm");
                        }
                    })
            })
            .catch(err => console.error("Lỗi:", err));
    }, [id]);

    if (!product) return <h2>Đang tải...</h2>;

    const addToCart = async () => {
        const user = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage
        if (!user) {
            toast.error("❗ Vui lòng đăng nhập để thêm vào giỏ hàng!");
            return;
        }
    
        if (!selectedSize || !selectedColor) {
            toast.warning("⚠️ Vui lòng chọn màu sắc và kích thước!");
            return;
        }
    
        const cartItem = {
            id_user: user.id,
            id_sp: product.id,
            tensp: product.ten_sp,
            gia: product.gia_khuyen_mai,
            img: selectedImage,
            so_luong: quantity,
            size: selectedSize,
            color: selectedColor,
        };
    
        try {
            const res = await fetch(`http://localhost:3000/giohang`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartItem),
            });
    
            if (!res.ok) {
                throw new Error("❌ Thêm vào giỏ hàng thất bại!");
            }
    
            const data = await res.json();
            console.log("Phản hồi server:", data);
    
            toast.success("🛒 Thêm vào giỏ hàng thành công!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
    
            // Nếu muốn cập nhật lại danh sách sau khi thêm
            setCartItems((prev) => [...prev, cartItem]);
    
        } catch (error) {
            console.error(error.message);
            toast.error("❌ Có lỗi xảy ra, vui lòng thử lại!");
        }
    };
    return (
        <div className="product-detail-page">
            {/* Khu vực ảnh sản phẩm */}
            <div className="product-image-area">
                <div className="product-image-wrapper">
                    <img className="product-main-image" src={selectedImage} alt={product.ten_sp} />
                </div>
                <div className="product-thumbnails">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index}`}
                            className={`product-thumbnail ${selectedImage === img ? "selected" : ""}`}
                            onClick={() => setSelectedImage(img)}
                        />
                    ))}
                </div>
            </div>
    
            {/* Khu vực thông tin sản phẩm */}
            <div className="product-info-section">
                <h1>{product.ten_sp}</h1>
                <p>Giá gốc: <span className="product-original-price">{product.gia_goc?.toLocaleString()}₫</span></p>
                <p>Giá khuyến mãi: <span className="product-discount-price">{product.gia_khuyen_mai?.toLocaleString()}₫</span></p>
                <p className="product-description-short">{product.mo_ta}</p>
    
                {/* Chọn màu sắc */}
                {product.mau_sac && typeof product.mau_sac === "string" && (
                    <div className="product-color-select">
                        <label>Chọn màu sắc:</label>
                        <div className="product-color-options">
                            {product.mau_sac.split(",").map((color, index) => {
                                const trimmedColor = color.trim();
                                return (
                                    <div
                                        key={index}
                                        className={`product-color-box ${selectedColor === trimmedColor ? "selected" : ""}`}
                                        style={{ backgroundColor: trimmedColor, cursor: "pointer" }}
                                        onClick={() => setSelectedColor(trimmedColor)}
                                    />
                                );
                            })}
                        </div>
                        {selectedColor && (
                            <p>
                                Màu đã chọn: <strong style={{ color: selectedColor }}>{selectedColor}</strong>
                            </p>
                        )}
                    </div>
                )}
    
                {/* Chọn size giày */}
                {product.size && typeof product.size === "string" && (
                    <div className="product-size-select">
                        <label>Chọn size giày:</label>
                        <div className="product-size-options">
                            {product.size.split(",").map((size, index) => {
                                const trimmedSize = size.trim();
                                return (
                                    <button
                                        key={index}
                                        className={`product-size-box ${selectedSize === trimmedSize ? "selected" : ""}`}
                                        onClick={() => setSelectedSize(trimmedSize)}
                                    >
                                        {trimmedSize}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedSize && (
                            <p>Size đã chọn: <strong>{selectedSize}</strong></p>
                        )}
                    </div>
                )}
    
                {/* Chọn số lượng */}
                <div className="product-quantity-select">
                    <label>Số lượng:</label>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
    
                {/* Thông tin giao hàng */}
                <div className="product-shipping-info">
                    <h3>Thông tin giao hàng</h3>
                    <p>Thời gian giao hàng dự kiến: <strong>2 - 5 ngày</strong></p>
                    <p>Phí vận chuyển: <strong>Miễn phí</strong> cho đơn hàng trên 500,000₫</p>
                    <p>Giao hàng trên toàn quốc</p>
                </div>
    
                <button className="product-add-to-cart" onClick={addToCart}>Thêm vào giỏ hàng</button>
            </div>
    
            {/* Thông tin sản phẩm và mô tả */}
            <div className="product-full-info">
                <h2>Thông tin sản phẩm</h2>
                <p>{InfoProduct.split("\n").map((line, index) => (
                    <span key={index}>{line}<br /></span>
                ))}</p>
            </div>
    
            <div className="product-long-description">
                <h2>Mô tả sản phẩm</h2>
                <p>{product.mo_ta || "Chưa có mô tả sản phẩm"}</p>
            </div>
    
            {/* Bình luận sản phẩm */}
            <div className="product-comments">
                <h2>Danh sách bình luận</h2>
                {comments.length > 0 ? (
                    <ul className="product-comment-list">
                        {comments.slice(0, 5).map((comment) => (
                            <li key={comment.id} className="product-comment-item">
                                <p><strong>{comment.user}</strong></p>
                                <p>{comment.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Chưa có bình luận nào.</p>
                )}
            </div>


            {/* Sản phẩm liên quan */}
            <div className="related-products">
                <h2>Sản phẩm liên quan</h2>
                <div className="related-list">
                    {relatedProducts.slice(0, 5).map((item) => (
                        <Link to={`/chitiet/${item.id}`} key={item.id} className="related-item">
                            <img src={item.hinh} alt={item.ten_sp} />
                            <p>{item.ten_sp}</p>
                            <p>{item.gia_khuyen_mai?.toLocaleString() || item.gia_goc?.toLocaleString()}₫</p>
                        </Link>
                    ))}
                </div>
            </div>
            {/* Sản phẩm bạn sẽ thích */}
            <div className="suggested-products">
                <h2>Sản phẩm bạn sẽ thích</h2>
                <div className="suggested-list">
                    {relatedProducts.slice(5, 10).map((item) => (
                        <Link to={`/chitiet/${item.id}`} key={item.id} className="suggested-item">
                            <img src={item.hinh} alt={item.ten_sp} />
                            <p>{item.ten_sp}</p>
                            <p>{item.gia_khuyen_mai?.toLocaleString() || item.gia_goc?.toLocaleString()}₫</p>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}
