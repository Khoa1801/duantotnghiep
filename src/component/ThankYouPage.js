import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ThankYouPage() {
  const location = useLocation();
  const [status, setStatus] = useState("Đang xác minh...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resultCode = queryParams.get("resultCode");
    const orderId = queryParams.get("orderId");

    if (resultCode === "0") {
      setStatus("🎉 Thanh toán thành công! Cảm ơn bạn.");
    } else {
      setStatus("❌ Thanh toán thất bại hoặc bị hủy.");
    }

    // Gửi đơn hàng về server để xác minh/cập nhật nếu muốn
    // axios.post("/api/momo/verify", { orderId });
  }, [location]);

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>{status}</h1>
    </div>
  );
}

export default ThankYouPage;
