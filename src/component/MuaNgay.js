import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/MuaNgay.css";

const CheckoutNow = () => {
  const location = useLocation();
  const product = location.state?.product || {};
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);  
const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
const [comment, setComment] = useState("");
const [rating, setRating] = useState(5);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod"); // mặc định là cod (thanh toán khi nhận hàng)
const [canComment, setCanComment] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  
  useEffect(() => {
    if (product.id) {
      fetch(`http://localhost:3000/products/${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Dữ liệu sản phẩm:", data); // ✅ Kiểm tra dữ liệu
  
          const colorList = data.mau_sac?.split(",").map((c) => c.trim()) || [];
          const sizeList = data.size?.split(",").map((s) => s.trim()) || [];
  
          setColors(colorList);
          setSizes(sizeList);
  
          // ✅ Kiểm tra xem có giá trị hay không
          if (colorList.length > 0) {
            setSelectedColor(colorList[0]); 
          }
          if (sizeList.length > 0) {
            setSelectedSize(sizeList[0]);
          }
        })
        .catch((error) => toast.error("Lỗi lấy dữ liệu sản phẩm!"));
    }
  }, [product.id]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetch(`http://localhost:3000/userinfo?id=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            toast.error("Không tìm thấy thông tin khách hàng!");
          } else {
            setCustomerInfo({
              full_name: data.full_name || "",
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
            });
          }
        })
        .catch(() => toast.error("Lỗi khi lấy thông tin khách hàng!"));
    } else {
      toast.error("Bạn chưa đăng nhập!");
    }
  }, []);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };
  const handlePayments = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        toast.error("Bạn chưa đăng nhập!");
        return;
    }

    if (!customerInfo.phone || !customerInfo.address) {
        toast.error("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (!product || quantity <= 0) {
        toast.error("Sản phẩm không hợp lệ!");
        return;
    }

    setIsProcessing(true);
    const totalPrice = product.gia_khuyen_mai * quantity;

    const orderData = {
      ho_ten: customerInfo.full_name,
      email: customerInfo.email,
      sdt: customerInfo.phone,
      address: customerInfo.address,
      tong_tien: totalPrice,
      id_user: user.id,
      paymentMethod: selectedPaymentMethod, // ⬅️ Bổ sung dòng này (ví dụ: 'cod', 'momo', 'zalopay')
      products: [
          {
              id_sp: product.id,
              so_luong: quantity,
              gia: product.gia_khuyen_mai,
              mau_sac: selectedColor, // Đổi tên `mau_sac` -> `color` (theo đúng API server)
              size: selectedSize,
          },
      ],
  };
  

    console.log("🔍 Dữ liệu gửi đi:", orderData);

    try {
        let response, data;

        if (paymentMethod === "cash") {
            response = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            data = await response.json();

            if (!response.ok) throw new Error(data.message || "❌ Lỗi khi tạo đơn hàng!");

            toast.success("✔️ Đặt hàng thành công! Hãy để lại đánh giá sản phẩm.");

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

            setTimeout(() => {
                setOrderSuccess(true);
                setCanComment(true);
                setShowCommentForm(true);
            }, 2000);
        }  // 1. Gửi đơn hàng trước (tương tự cash)
        response = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        
        data = await response.json();
        
        if (!response.ok) throw new Error(data.message || "❌ Không thể tạo đơn hàng!");
        
        else if (paymentMethod === "vnpay") {
          const amount = totalPrice;
          const orderInfo = `Thanh toán đơn hàng #${data.orderId || "không rõ"}`;
        
          const queryParams = new URLSearchParams({
            amount: amount.toString(),
            orderInfo,
          });
        
          try {
            const paymentRes = await fetch(`http://localhost:3000/create_payment?${queryParams}`);
            const paymentData = await paymentRes.json();
        
            if (paymentData?.paymentUrl) {
              toast.success("🔄 Đang chuyển đến trang thanh toán...");
              setTimeout(() => {
                window.location.href = paymentData.paymentUrl;
              }, 1500);
            } else {
              toast.error("❌ Không tạo được link thanh toán VNPAY!");
            }
          } catch (error) {
            toast.error("❌ Có lỗi xảy ra khi kết nối đến VNPAY!");
            console.error(error);
          }
        }
         else if (paymentMethod === "zalopay") {
          const zaloRes = await fetch("http://localhost:3000/zalo/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: product.gia_khuyen_mai,
              description: `Thanh toán đơn hàng #${data.orderId || "không rõ"}`,
            }),
          });
        
          const zaloData = await zaloRes.json();
        
          if (zaloData?.data?.order_url) {
            toast.success("🔄 Đang chuyển đến trang thanh toán ZaloPay...");
            setTimeout(() => {
              window.location.href = zaloData.data.order_url;
            }, 1500);
          } else {
            toast.error("❌ Không tạo được link thanh toán ZaloPay!");
          }
        
        } else if (paymentMethod === "momo") {
          const momoRes = await fetch("http://localhost:3000/momo/create_momo_payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: product.gia_khuyen_mai,
              returnUrl: "http://localhost:3000/thankyou", // Hoặc trang bạn muốn redirect về
              orderInfo: `Thanh toán đơn hàng #${data.orderId || "không rõ"}`
            }),
          });
        
          const momoData = await momoRes.json();
        
          if (momoData?.payUrl) {
            toast.success("🔄 Đang chuyển đến trang thanh toán MoMo...");
            setTimeout(() => {
              window.location.href = momoData.payUrl;
            }, 1500);
          } else {
            toast.error("❌ Không tạo được link thanh toán MoMo!");
          }
        }
        
        
      
      
  } catch (error) {
      console.error("❌ Lỗi khi xử lý thanh toán:", error);
      toast.error(error.message || "❌ Lỗi khi xử lý thanh toán!");
  } finally {
      setIsProcessing(false);
  }
};

const handleSubmitComment = async () => {
  if (!comment.trim()) {
    toast.error("Vui lòng nhập bình luận!");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    toast.error("Bạn cần đăng nhập để bình luận!");
    return;
  }

  const commentData = {
    user_id: user.id,
    product_id: product.id,
    comment,
    rating,
  };

  try {
    const response = await fetch("http://localhost:3000/add-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Lỗi khi gửi bình luận!");

    toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
    setShowCommentForm(false);
  } catch (error) {
    toast.error(error.message || "Lỗi khi gửi bình luận!");
  }
};

useEffect(() => {
  const checkUserPurchase = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !product?.id) return; 

    try {
      const response = await fetch(
        `http://localhost:3000/check-purchase?user_id=${user.id}&product_id=${product.id}`
      );
      const data = await response.json();

      if (response.ok) {
        setCanComment(data.canComment);
        setShowCommentForm(data.canComment); // ✅ Cập nhật luôn trạng thái hiển thị form
      }
    } catch (error) {
      console.error("Lỗi kiểm tra đơn hàng:", error);
    }
  };

  checkUserPurchase();
}, [product.id]);


  return (
    <div className="checkout-container">
  {/* Thông tin sản phẩm */}
  <div className="product-info">
    <h2>Sản phẩm</h2>

    <div className="product-details-container">
      <img src={product.hinh} alt={product.ten_sp} />
      <div className="product-details">
        <h3>{product.ten_sp}</h3>
        <p>Giá: <strong>{product.gia_khuyen_mai?.toLocaleString()} VND</strong></p>
      </div>
    </div>

    <div className="selection-group">
      <label>Màu sắc</label>
      <div className="color-options">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`color-circle ${selectedColor === color ? "active" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          ></div>
        ))}
      </div>

      <label>Size</label>
      <div className="size-options">
        {sizes.map((size, index) => (
          <button
            key={index}
            className={selectedSize === size ? "size-btn active" : "size-btn"}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Form thanh toán */}
  <div className="checkout-form">
    <h2>Thanh Toán</h2>

    <div className="quantity-group">
      <label>Số lượng</label>
      <button
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
    </div>

    <div className="customer-info">
      {["full_name", "email", "phone", "address"].map((field, index) => (
        <input
          key={index}
          type={field === "email" ? "email" : "text"}
          name={field}
          value={customerInfo[field]}
          onChange={handleChange}
          placeholder={
            field === "full_name"
              ? "Họ tên"
              : field === "phone"
              ? "Số điện thoại"
              : field === "address"
              ? "Địa chỉ"
              : "Email"
          }
        />
      ))}
    </div>

    <div className="payment-method">
      <h3>Phương thức thanh toán</h3>
      {[
        { id: "cash", label: "Tiền mặt khi nhận hàng" },
        { id: "vnpay", label: "VNPay" },
        { id: "zalopay", label: "ZaloPay" },
        { id: "momo", label: "MomoPay" },
      ].map((method) => (
        <label key={method.id} className={paymentMethod === method.id ? "payment-option active" : "payment-option"}>
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={paymentMethod === method.id}
            onChange={() => setPaymentMethod(method.id)}
          />
          <span>{method.label}</span>
        </label>
      ))}
    </div>

    <button onClick={handlePayments} disabled={isProcessing}>
      {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
    </button>

    {orderSuccess && (
      <div className="order-success">
        <h2>🎉 Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng! Bạn có thể để lại đánh giá sản phẩm.</p>

        {canComment && showCommentForm && (
          <div className="comment-section">
            <h3>Đánh giá sản phẩm</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
            ></textarea>

            <div className="rating">
              <label>Chọn số sao:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>{star} ⭐</option>
                ))}
              </select>
            </div>

            <button onClick={handleSubmitComment}>
              Gửi bình luận
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</div>

  )
};

export default CheckoutNow;
