import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/blog/${id}`);

        if (!response.ok) throw new Error("Bài viết không tồn tại");

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="blog-detail">
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Đang tải bài viết...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      ) : (
        <div className="blog-content fade-in">
          <h1 className="blog-title">{post.tieu_de}</h1>
          <img className="blog-image" src={post.hinh} alt={post.tieu_de} />
          <div
            className="blog-text"
            dangerouslySetInnerHTML={{ __html: post.noi_dung }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
