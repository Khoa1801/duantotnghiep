import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TinTuc.css"; // Import file CSS

const TinTuc = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/tin_tuc") // API lấy danh sách tin tức
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.error("Lỗi khi lấy tin tức:", err));
  }, []);

  const maxIndex = Math.max(0, Math.floor((news.length - 1) / 3) * 3);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 3 > maxIndex ? 0 : prevIndex + 3));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 3 < 0 ? maxIndex : prevIndex - 3));
  };

  const handleNewsClick = (id) => {
    navigate(`/post/${id}`); // Chuyển hướng đến trang chi tiết blog
  };

  return (
    <div className="news-container">
      <h2 className="news-title">Tin Tức Mới Nhất</h2>
      <div className="news-slider">
        <button className="prev-btn" onClick={prevSlide}>&#10094;</button>
        <div className="news-list">
          <div
            className="news-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
              transition: "transform 0.6s ease-in-out",
            }}
          >
            {news.map((item) => (
              <div
                className="news-item"
                key={item.id}
                onClick={() => handleNewsClick(item.id)}
              >
                <img src={item.hinh_anh} alt={item.tieu_de} className="news-img" />
                <h3 className="news-heading">{item.tieu_de}</h3>
                <p className="news-description">{item.mo_ta}</p>
                <small className="news-date">
                  {new Date(item.ngay_dang).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        </div>
        <button className="next-btn" onClick={nextSlide}>&#10095;</button>
      </div>
    </div>
  );
};

export default TinTuc;
