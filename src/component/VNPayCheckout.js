import React, { useEffect } from "react";
import { toast } from "react-toastify";

const VNPayCheckout = ({ product }) => {
  const handlePayment = () => {
    fetch("http://localhost:3000/create_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(product?.gia_khuyen_mai || product?.price),
        orderInfo: `Thanh toán sản phẩm: ${product?.ten_san_pham}`,
        // Thêm thông tin người dùng nếu có
        // customerId: user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Payment URL:", data);
        if (data?.paymentUrl) {
          toast.success("🔄 Đang chuyển hướng đến cổng thanh toán VNPAY...");
          setTimeout(() => {
            window.location.href = data.paymentUrl;
          }, 1500);
        } else {
          toast.error("❌ Không thể tạo URL thanh toán!");
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi API thanh toán:", err);
        toast.error("🚫 Kết nối đến server thất bại!");
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Thanh toán VNPAY</h2>
      <div className="mb-4">
        <p className="text-gray-700">
          <strong>Sản phẩm:</strong> {product?.ten_san_pham}
        </p>
        <p className="text-gray-700">
          <strong>Giá:</strong> {Number(product?.gia_khuyen_mai || product?.price).toLocaleString()} VND
        </p>
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Thanh toán với VNPAY
      </button>
    </div>
  );
};

export default VNPayCheckout;
