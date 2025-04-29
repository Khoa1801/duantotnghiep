import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const paymentMethod = searchParams.get("paymentMethod");
    const appTransId = searchParams.get("app_trans_id");

    if (paymentMethod === "zalopay" && appTransId) {
      fetch("http://localhost:3000/zalo/check-status-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app_trans_id: appTransId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.return_code === 1) {
            toast.success("✅ Thanh toán ZaloPay thành công!");
            setStatus("success");
          } else {
            toast.error("❌ Thanh toán thất bại hoặc chưa hoàn tất!");
            setStatus("failed");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("❌ Không kiểm tra được trạng thái thanh toán!");
          setStatus("error");
        });
    } else {
      setStatus("invalid");
    }
  }, []);

  return (
    <div className="p-4 text-center">
      {status === "loading" && <p>🔄 Đang kiểm tra trạng thái thanh toán...</p>}
      {status === "success" && <p className="text-green-600">🎉 Thanh toán thành công!</p>}
      {status === "failed" && <p className="text-red-600">❌ Thanh toán thất bại!</p>}
      {status === "error" && <p className="text-yellow-600">⚠️ Có lỗi xảy ra!</p>}
      {status === "invalid" && <p>⚠️ Thiếu thông tin thanh toán!</p>}
    </div>
  );
};

export default PaymentResult;
