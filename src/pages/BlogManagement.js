import React, { useState, useEffect } from "react";
import "../css/blog1.css";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:3000/blog");
      if (!res.ok) throw new Error("Không thể tải bài viết");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      setError("Lỗi khi tải bài viết.");
    }
  };

  const openModal = (blog = null) => {
    setSelectedBlog(blog || { tieu_de: "", mo_ta: "", hinh: "", noi_dung: "", id_loai: 1 });
    setIsEditing(!!blog);
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    const blogData = {
      tieu_de: selectedBlog.tieu_de,
      slug: selectedBlog.tieu_de.toLowerCase().replace(/\s+/g, '-'),
      mo_ta: selectedBlog.mo_ta,
      hinh: selectedBlog.hinh,
      noi_dung: selectedBlog.noi_dung || "Nội dung bài viết",
      id_loai: selectedBlog.id_loai || 1,
      an_hien: 1,
      tac_gia: "Tác giả mẫu",
      ngay_dang: new Date().toISOString()
    };

    try {
      if (isEditing) {
        const res = await fetch(`http://localhost:3000/blog/${selectedBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });
        if (!res.ok) throw new Error("Lỗi khi cập nhật bài viết.");
        setBlogs(blogs.map((b) => (b.id === selectedBlog.id ? { ...b, ...blogData } : b)));
      } else {
        const res = await fetch("http://localhost:3000/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        });
        if (!res.ok) throw new Error("Lỗi khi thêm bài viết.");
        const newBlog = await res.json();
        setBlogs([...blogs, newBlog]);
      }
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    console.log("Deleting blog with ID:", deleteId); // Kiểm tra ID đang được xóa
    try {
      const res = await fetch(`http://localhost:3000/blog/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi khi xóa bài viết");

      const data = await res.json();
      console.log("Xóa thành công: ", data);

      setBlogs(blogs.filter((blog) => blog.id !== deleteId)); // Cập nhật lại danh sách blog
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      setError("Không thể xóa bài viết.");
    }
  };

  return (
    <div className="blog-container15">
      <div className="blog-header15">
        <h2 className="blog-title15">Quản lý Blog</h2>
        <button className="blog-add-btn15" onClick={() => openModal()}>+ Thêm bài viết</button>
      </div>

      <div className="blog-grid15">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card15">
            <div>
              <img src={blog.hinh} alt={blog.tieu_de} className="blog-image15" />
              <h3 className="blog-card-title15">{blog.tieu_de}</h3>
              <p className="blog-card-desc15">{blog.mo_ta}</p>
            </div>
            <div className="blog-actions15">
              <button className="blog-edit-btn15" onClick={() => openModal(blog)}>Sửa</button>
              <button className="blog-delete-btn15" onClick={() => confirmDelete(blog.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay15">
          <div className="modal-content15">
            <h3 className="modal-title15">{isEditing ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}</h3>
            {error && <div className="modal-error15">{error}</div>}
            <input className="modal-input15" type="text" placeholder="Tiêu đề" value={selectedBlog.tieu_de} onChange={(e) => setSelectedBlog({ ...selectedBlog, tieu_de: e.target.value })} />
            <textarea className="modal-input15" placeholder="Mô tả" value={selectedBlog.mo_ta} onChange={(e) => setSelectedBlog({ ...selectedBlog, mo_ta: e.target.value })}></textarea>
            <textarea className="modal-input15" placeholder="Nội dung" value={selectedBlog.noi_dung} onChange={(e) => setSelectedBlog({ ...selectedBlog, noi_dung: e.target.value })}></textarea>
            <input className="modal-input15" type="text" placeholder="Link Hình Ảnh" value={selectedBlog.hinh} onChange={(e) => setSelectedBlog({ ...selectedBlog, hinh: e.target.value })} />
            <div className="modal-actions15">
              <button className="modal-save-btn15" onClick={handleSave}>Lưu</button>
              <button className="modal-cancel-btn15" onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay15">
          <div className="modal-content15">
            <h3 className="modal-title15">Bạn có chắc chắn muốn xóa bài viết này?</h3>
            <div className="modal-actions15">
              <button className="modal-save-btn15" onClick={handleDelete}>Xóa</button>
              <button className="modal-cancel-btn15" onClick={() => setShowDeleteModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
