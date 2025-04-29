import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Blog.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["All", "Fashion", "Streetwear", "Women"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/blog");
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      (selectedCategory === "All" || post.category === selectedCategory) &&
      post.tieu_de.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="blog-container">
      <header className="blog-header" role="banner">
        <h1 className="blog-title">Blog Thời Trang</h1>
        <p className="blog-subtitle">Khám phá những xu hướng mới nhất</p>
      </header>

      <section className="blog-main">
        {/* Sidebar */}
        <aside className="blog-sidebar" aria-label="Sidebar blog">
          <div className="search-section">
            <label htmlFor="search" className="visually-hidden">
              Tìm kiếm bài viết
            </label>
            <input
              type="text"
              id="search"
              placeholder="Tìm kiếm bài viết..."
              className="search-bar-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <nav className="blog-categories" aria-label="Danh mục bài viết">
            <h2>Danh mục</h2>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-button ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          <section className="popular-posts">
            <h2>Bài viết nổi bật</h2>
            <ul>
              {posts
                .filter((post) => post.an_hien === 1)
                .slice(0, 5)
                .map((highlighted) => (
                  <li key={highlighted.id}>
                    <Link
                      to={`/post/${highlighted.id}`}
                      title={highlighted.tieu_de}
                    >
                      {highlighted.tieu_de}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </aside>

        {/* Nội dung chính */}
        <section className="blog-content">
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="blog-list">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article key={post.id} className="blog-card">
                    <img
                      src={post.hinh}
                      alt={`Hình ảnh bài viết: ${post.tieu_de}`}
                      loading="lazy"
                    />
                    <div className="card-content">
                      <h3>{post.tieu_de}</h3>
                      <p>{post.mo_ta}</p>
                      <Link
                        to={`/post/${post.id}`}
                        className="read-more"
                        title={`Xem chi tiết bài viết: ${post.tieu_de}`}
                      >
                        Đọc thêm
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <p className="no-results">Không tìm thấy bài viết phù hợp.</p>
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default BlogList;
