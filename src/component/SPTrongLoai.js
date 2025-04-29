import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/SPTrongLoai.css";

const SPTrongLoai = () => {
    const { id_loai } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    const id_user = 1; // tạm thời cứng ID user, bạn có thể lấy từ localStorage hoặc context nếu có

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                const categoryRes = await fetch(`http://localhost:3000/loai/${id_loai}`);
                const categoryData = await categoryRes.json();
                if (!categoryRes.ok) throw new Error(categoryData.message);
                setCategory(categoryData);

                const productRes = await fetch(`http://localhost:3000/sptrongloai/${id_loai}`);
                const productData = await productRes.json();
                if (!productRes.ok) throw new Error(productData.message);
                setProducts(productData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [id_loai]);

    const handleAddToCart = async (product, index) => {
        const size = document.getElementById(`size-${index}`).value;
        const color = document.getElementById(`color-${index}`).value;
        const so_luong = parseInt(document.getElementById(`qty-${index}`).value) || 1;

        try {
            const res = await fetch("http://localhost:3000/giohang", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_user,
                    id_sp: product.id,
                    tensp: product.ten_sp,
                    gia: product.gia_khuyen > 0 ? product.gia_khuyen : product.gia_goc,
                    img: product.hinh,
                    so_luong,
                    size,
                    color
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setNotification("✅ " + data.message);
            setTimeout(() => setNotification(null), 2000);
        } catch (err) {
            setNotification("❌ " + err.message);
            setTimeout(() => setNotification(null), 2000);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="category-page">
            {notification && <div className="notification">{notification}</div>}

            <div className="category-header">
                <h2>{category?.ten_loai}</h2>
                <button className="back-btn" onClick={() => navigate("/danhmuc")}>
                    ← Quay lại danh mục
                </button>
            </div>

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={product.id} className="product-card">
                            <img src={product.hinh} alt={product.ten_sp} />
                            <h3>{product.ten_sp}</h3>
                            <p className="price">
                                {product.gia_khuyen > 0 ? (
                                    <>
                                        <span className="old-price">{product.gia_goc}₫</span>
                                        <span className="discount-price">{product.gia_khuyen}₫</span>
                                    </>
                                ) : (
                                    <span className="final-price">{product.gia_goc}₫</span>
                                )}
                            </p>

                            <div className="options">
                                <select id={`size-${index}`}>
                                    <option value="S">Size S</option>
                                    <option value="M">Size M</option>
                                    <option value="L">Size L</option>
                                    <option value="XL">Size XL</option>
                                </select>
                                <select id={`color-${index}`}>
                                    <option value="Đen">Đen</option>
                                    <option value="Trắng">Trắng</option>
                                    <option value="Xám">Xám</option>
                                </select>
                                <input type="number" min="1" id={`qty-${index}`} defaultValue={1} />
                            </div>

                            <button
                                className="add-cart-btn"
                                onClick={() => handleAddToCart(product, index)}
                            >
                                🛒 Thêm vào giỏ
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-products">Không có sản phẩm nào.</p>
                )}
            </div>
        </div>
    );
};

export default SPTrongLoai;
