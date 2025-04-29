import React, { useState } from "react";
import { toast } from "react-toastify";

const CommentForm = ({ product, userId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
   const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const totalPrice = product.gia_khuyen_mai * quantity;


const [customerInfo, setCustomerInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Vui lòng nhập bình luận!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/add-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          comment,
          rating,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi gửi bình luận!");

      toast.success(`Đã gửi đánh giá cho sản phẩm ${product.ten_sp}`);
      setComment("");
      setRating(5);

      // 📨 Gửi email xác nhận đơn hàng
      await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: customerInfo.email,
            subject: "Xác nhận đơn hàng",
            message: `
                
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
<h2 style="color: #2c3e50; text-align: center;">Xin chào ${customerInfo.full_name},</h2>
<p style="font-size: 16px; color: #555; text-align: center;">
    Cảm ơn bạn đã đặt hàng tại <strong style="color: #e74c3c;">Cửa hàng của chúng tôi</strong>!
</p>

<div style="text-align: center; margin-bottom: 15px;">
    <img src="${product.hinh}" alt="Sản phẩm ${product.ten_sp}" 
        style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
</div>

<p style="font-size: 16px; color: #333; text-align: center;">
    <strong style="font-size: 18px;">Chi tiết đơn hàng của bạn:</strong>
</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Sản phẩm</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${product.ten_sp}</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Màu sắc</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${selectedColor}</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Kích thước</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${selectedSize}</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Số lượng</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${quantity}</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Tổng tiền</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd; color: #e74c3c; font-weight: bold;">
            ${totalPrice.toLocaleString("vi")} VNĐ
        </td>
    </tr>
</table>

<p style="font-size: 16px; color: #555; text-align: center; margin-top: 15px;">
    Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn! 🚚<br/>
    <strong style="color: #27ae60;">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!</strong>
</p>

<div style="text-align: center; margin-top: 20px;">
    <a href="http://your-shop.com" 
        style="display: inline-block; padding: 10px 20px; background-color: #3498db; 
        color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
        Tiếp tục mua sắm 🛍️
    </a>
</div>
</div>
`
,
        }),
    });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="border p-4 rounded-lg mb-4">
      <h4 className="font-semibold mb-2">Đánh giá sản phẩm: {product.ten_sp}</h4>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Nhập bình luận của bạn"
      />
      <div className="flex items-center mb-2">
        <span className="mr-2">Đánh giá:</span>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>
              {rate} ⭐
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Gửi bình luận
      </button>
    </div>
  );
};

export default CommentForm;
