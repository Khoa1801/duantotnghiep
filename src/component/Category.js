import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Categori.css";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:3000/loai");
                if (!response.ok) throw new Error("Lỗi khi tải dữ liệu danh mục!");
                const data = await response.json();
                const visibleCategories = data.filter(category => category.an_hien === 1);
                setCategories(visibleCategories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-container">
            <h2 className="category-title">Danh Mục Sản Phẩm</h2>

            {loading ? (
                <div className="loading">Đang tải danh mục...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : categories.length > 0 ? (
                <div className="category-grid">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="category-card"
                            onClick={() => navigate(`/sptrongloai/${category.id}`)}
                        >
                            <img
                                src={category.hinh || "https://via.placeholder.com/150"}
                                alt={category.ten_loai}
                                loading="lazy"
                            />
                            <h3>{category.ten_loai}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-category">Không có danh mục nào hiển thị.</p>
            )}
        </div>
    );
};

export default Category;
