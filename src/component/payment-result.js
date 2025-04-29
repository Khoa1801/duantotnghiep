import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  useEffect(() => {
    if (status === "success") {
      toast.success("✅ Thanh toán thành công!");
    } else if (status === "fail") {
      toast.error("❌ Thanh toán thất bại!");
    } else {
      toast.warning("⚠️ Dữ liệu thanh toán không hợp lệ!");
    }
  }, [status]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold">
        {status === "success"
          ? "🎉 Cảm ơn bạn đã thanh toán!"
          : status === "fail"
          ? "😢 Thanh toán không thành công."
          : "⚠️ Xác thực không hợp lệ"}
      </h2>
    </div>
  );
};

export default PaymentResult;
