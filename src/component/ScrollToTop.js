import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn mượt lên đầu trang
  }, [pathname]); // Chạy khi đường dẫn thay đổi

  return null;
}

export default ScrollToTop;
