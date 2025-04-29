import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/Banner.css";

const banners = [
  {
    title: "Converse",
    description: "Khám phá phong cách của bạn",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/b6c9dc142413715.6266b8eeb29f1.png",
  },
  {
    title: "Converse",
    description: "Sự kết hợp giữa cổ điển và hiện đại",
    image: "https://www.courir.com/on/demandware.static/-/Library-Sites-Courir/default/dwe84201a2/PAGE%20MARQUE/CONVERSE/BLOC1_ENCART_1440x620/CONVERSE-WEDGE-CT70-BANNER-DESKTOP-1440x600px.jpg",
  },
  {
    title: "Converse",
    description: "Tạo nên sự khác biệt",
    image: "https://coolmaterial.com/wp-content/uploads/2018/01/Converse-Chuck-Taylor-70s-Vintage-Collection.jpg",
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Kiểm tra nếu ở trang chủ thì giữ banner lớn, nếu trang khác thì thu nhỏ lại
  const isHomePage = location.pathname === "/";

  return (
    <div className={`banner ${isHomePage ? "large-banner" : "small-banner"}`}>
      <div
        className="banner-background"
        style={{ backgroundImage: `url(${banners[activeIndex].image})` }}
      ></div>

      <div className="banner-overlay"></div>

      <div className="banner-content">
        {!isHomePage && <h2 className="page-title">{location.pathname.replace("/", "").toUpperCase() || "TRANG CHỦ"}</h2>}
        <h1 className="banner-title">{banners[activeIndex].title}</h1>
        <p className="banner-description">{banners[activeIndex].description}</p>
        <button className="buy-now-btn">Mua ngay</button>

        <div className="banner-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`dot ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
