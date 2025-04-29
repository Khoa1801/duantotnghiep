import '../css/cart.css';
import { toast } from "react-toastify";
import axios from "axios";
import CommentForm from "./CommentForm"; // đường dẫn đúng file bạn vừa tạo
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import DiscountCode from "./DiscountCode"; // Import component mới


function ThanhToan() {
    const location = useLocation();
      const product = location.state?.product || {};
    const [cartItems, setCartItems] = useState([]);
    const [discount, setDiscount] = useState(0); // Lưu giá trị giảm giá
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderMessage, setOrderMessage] = useState('');
      const [selectedColor, setSelectedColor] = useState("");
      const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod"); // mặc định là cod (thanh toán khi nhận hàng)
        const [colors, setColors] = useState([]);
        const [sizes, setSizes] = useState([]); 
      const [selectedSize, setSelectedSize] = useState("");  
      const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState({});
    const userId = localStorage.getItem("userId");
    const totalPrice = product.gia_khuyen_mai * quantity;
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

    const validateForm = () => {
        let newErrors = {};

        if (!customerName.trim()) {
            newErrors.customerName = "Họ và tên không được để trống!";
        } else if (customerName.length < 3) {
            newErrors.customerName = "Họ và tên phải có ít nhất 3 ký tự!";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customerEmail.trim()) {
            newErrors.customerEmail = "Email không được để trống!";
        } else if (!emailPattern.test(customerEmail)) {
            newErrors.customerEmail = "Email không hợp lệ!";
        }

        const phonePattern = /^(0|\+84)[0-9]{9,10}$/;
        if (!customerPhone.trim()) {
            newErrors.customerPhone = "Số điện thoại không được để trống!";
        } else if (!phonePattern.test(customerPhone)) {
            newErrors.customerPhone = "Số điện thoại không hợp lệ!";
        }

        if (!customerAddress.trim()) {
            newErrors.customerAddress = "Địa chỉ không được để trống!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleClearCart = () => {
        fetch("http://localhost:3000/giohang", { method: "DELETE" })
            .then(() => {
                setCartItems([]);
                toast.success("🛒 Giỏ hàng đã được làm trống!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(error => {
                console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
                toast.error("❌ Không thể làm trống giỏ hàng, thử lại!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            });
    };
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

   
       // ✅ Gọi API lấy thông tin user dựa trên email
       const fetchUserInfo = () => {
        const userData = localStorage.getItem("user"); // Lấy dữ liệu user từ localStorage
        if (!userData) {
          toast.error("Bạn chưa đăng nhập!");
          return;
        }
      
        const parsedUser = JSON.parse(userData);
        const userId = parsedUser?.id;
      
        if (!userId) {
          toast.error("Không tìm thấy thông tin khách hàng!");
          return;
        }
      
        fetch(`http://localhost:3000/userinfo?id=${userId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              toast.error("Không tìm thấy thông tin khách hàng!");
            } else {
              setCustomerName(data.full_name || "");
              setCustomerPhone(data.phone || "");
              setCustomerAddress(data.address || "");
              setCustomerEmail(data.email || "");
              setShowModal(true); // Mở modal khi lấy được thông tin
            }
          })
          .catch(() => toast.error("Lỗi khi lấy thông tin khách hàng!"));
      };
      

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsProcessing(true);
            // Process further like sending the order information
            // Reset form or show success message after submission
        }
    };

    useEffect(() => {
        if (!userId) {
            console.warn("⚠️ Không tìm thấy userId!");
            return;
        }

        fetch(`http://localhost:3000/giohang/${userId}`)
            .then(res => res.json())
            .then(data => setCartItems(data))
            .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
    }, [userId]);

    const handleRemoveItem = async (id_sp) => {
        const user = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage
        if (!user) {
            toast.error("Bạn chưa đăng nhập!");
            return;
        }

        const id_user = user.id; // Lấy ID user từ localStorage

        try {
            const response = await axios.delete(`http://localhost:3000/giohang/${id_user}/${id_sp}`);
            console.log("Phản hồi từ server:", response.data);

            if (response.status === 200) {
                toast.success("🗑️ Xóa sản phẩm thành công!");
                setCartItems((prev) => prev.filter(item => item.id_sp !== id_sp)); // Cập nhật lại giỏ hàng
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
            toast.error("❌ Xóa sản phẩm thất bại!");
        }
    };


    const updateQuantity = (id_sp, newQuantity) => {
        if (newQuantity < 1) return;

        const user = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage
        if (!user) {
            toast.error("Bạn chưa đăng nhập!");
            return;
        }

        const id_user = user.id; // Lấy ID user từ localStorage

        fetch(`http://localhost:3000/giohang/${id_user}/${id_sp}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ so_luong: newQuantity })
        })
            .then((res) => {
                if (!res.ok) throw new Error("Lỗi cập nhật số lượng!");
                return res.json();
            })
            .then(() => {
                setCartItems(cartItems.map(item =>
                    item.id_sp === id_sp ? { ...item, so_luong: newQuantity } : item
                ));
                toast.success("✔️ Cập nhật số lượng thành công!");
            })
            .catch(error => {
                console.error("Lỗi khi cập nhật số lượng:", error);
                toast.error("❌ Cập nhật số lượng thất bại!");
            });
    };


    const totalAmount = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + (item.gia * item.so_luong), 0);
        return Math.max(subtotal - discount, 0); // Đảm bảo tổng không bị âm
    };
    const handlePayments = async () => {
        if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
            setOrderMessage("❗ Vui lòng nhập đầy đủ thông tin khách hàng!");
            return;
        }
    
        setIsProcessing(true);
    
        try {
            let response, data;
            response = await fetch("http://localhost:3000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ho_ten: customerName,
                    email: customerEmail,
                    sdt: customerPhone,
                    address: customerAddress,
                    tong_tien: totalAmount(),
                    id_user: userId,
                    paymentMethod: selectedPaymentMethod, // ⬅️ THÊM TRƯỜNG NÀY (ví dụ: 'cod', 'momo', 'zalopay', 'vnpay')
                    products: cartItems.map(item => ({
                        id_sp: item.id_sp,
                        so_luong: item.so_luong,
                        gia: item.gia,
                        size: item.size || null,
                        color: item.color || null
                    })),
                }),
            });
            
            data = await response.json();

            if (!response.ok) throw new Error(data.error || "Lỗi khi lưu đơn hàng!");
    
            // ✅ Sau khi có đơn hàng rồi mới xử lý tiếp theo
            const orderId = data.orderId || generateOrderId();

            if (paymentMethod === 'cash') {
                
    
                if (!response.ok) throw new Error(data.error || "Lỗi khi lưu đơn hàng!");
    
                // ✅ Xóa giỏ hàng trong database
                for (const item of cartItems) {
                    await fetch(`http://localhost:3000/giohang/${item.id_gh}`, { method: "DELETE" });
                }
    
                // ✅ Xóa giỏ hàng trên client
                setCartItems([]);
                setOrderMessage("✅ Thanh toán thành công! Đơn hàng đã được lưu.");
                setShowModal(false);    
                // Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async () => {
    if (!customerInfo.email) {
      console.warn("⚠️ Không có email khách hàng để gửi xác nhận!");
      return;
    }
  
    // Tạo nội dung sản phẩm
const productRows = cartItems
.map((item) => {
  return `
    <tr>
  <td style="padding: 10px; border: 1px solid #ddd;">
    <img src="${item.img}" alt="${item.tensp}" style="width: 60px; height: auto;" />
  </td>
  <td style="padding: 10px; border: 1px solid #ddd;">${item.tensp}</td>
  <td style="padding: 10px; border: 1px solid #ddd;">${item.color || "Không chọn"}</td>
  <td style="padding: 10px; border: 1px solid #ddd;">${item.size || "Không chọn"}</td>
  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.so_luong}</td>
  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${(item.gia * item.so_luong).toLocaleString("vi-VN")} VNĐ</td>
</tr>

  `;
})
.join("");

const messageContent = `
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #2c3e50; text-align: center;">Xin chào ${customerInfo.full_name},</h2>
  <p style="font-size: 16px; color: #555; text-align: center;">
    Cảm ơn bạn đã đặt hàng tại <strong style="color: #e74c3c;">Cửa hàng của chúng tôi</strong>!
  </p>

  <p style="font-size: 16px; color: #333; text-align: center;">
    <strong style="font-size: 18px;">Chi tiết đơn hàng của bạn:</strong>
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
    <tr>
    <th style="padding: 10px; border: 1px solid #ddd;">Hình ảnh</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Màu sắc</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Kích thước</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Số lượng</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Thành tiền</th>
    </tr>
    ${productRows}
  </table>

  <p style="font-size: 16px; color: #555; text-align: center; margin-top: 15px;">
    <strong style="color: #27ae60;">Tổng tiền: ${totalAmount().toLocaleString("vi-VN")} VNĐ</strong>
  </p>

  <p style="font-size: 16px; color: #555; text-align: center; margin-top: 10px;">
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
`;

// Gửi email
setEmailData({
to: customerInfo.email,
subject: "Xác nhận đơn hàng",
message: messageContent,
});

try {
const res = await fetch("http://localhost:3000/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: customerInfo.email,
    subject: "Xác nhận đơn hàng",
    message: messageContent,
  }),
});

if (!res.ok) {
  throw new Error("Lỗi gửi email xác nhận");
}
} catch (error) {
console.error("Gửi email thất bại:", error.message);
}
};
  

  await sendOrderConfirmationEmail();

            }


            if (paymentMethod === "vnpay") {
                const paymentRes = await fetch("http://localhost:3000/create_payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: totalAmount(),
                        orderInfo: `Thanh toán đơn hàng #${orderId}`,
                    }),
                });
    
                const paymentData = await paymentRes.json();
    
                if (paymentData?.paymentUrl) {
                    toast.success("🔄 Đang chuyển đến trang thanh toán VNPAY...");
                    setTimeout(() => {
                        window.location.href = paymentData.paymentUrl;
                    }, 1500);
                } else {
                    toast.error("❌ Không tạo được link thanh toán VNPAY!");
                }
            } else if (paymentMethod === "zalopay") {
                const zaloRes = await fetch("http://localhost:3000/zalo/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: totalAmount(),
                        description: `Thanh toán đơn hàng #${orderId}`,
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
                        amount: totalAmount(),
                        returnUrl: "http://localhost:3000/thankyou",
                        orderInfo: `Thanh toán đơn hàng #${orderId}`
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
            console.error("Lỗi khi thanh toán:", error);
            setOrderMessage("❌ Thanh toán thất bại, vui lòng thử lại.");
        } finally {
            setIsProcessing(false);
        }
    };

    // ✅ Tạo mã đơn hàng duy nhất
    const generateOrderId = () => {
        return "ORDER_" + new Date().getTime();
    };


    return (
        <div className="body1">
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Sản Phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.length > 0 ? cartItems.map((item, index) => (

                        <tr key={index} className="cart-item">

                            <td className="product-details">

                                <img src={item.img || "converse.jpg"} alt={item.tensp} />
                                <span>{item.tensp}</span>
                            </td>
                            <td>{item.gia.toLocaleString()}đ</td>
                            <td className='quantity'>
                                <button className="quantity-btn" onClick={() => updateQuantity(item.id_sp, item.so_luong - 1)}>-</button>
                                <input type="text" value={item.so_luong} readOnly className="quantity-input" />
                                <button className="quantity-btn" onClick={() => updateQuantity(item.id_sp, item.so_luong + 1)}>+</button>
                            </td>

                            <td>{(item.gia * item.so_luong).toLocaleString()}đ</td>
                            <td>
                                <button className="delete-btn" onClick={() => handleRemoveItem(item.id_sp)}>Xóa</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Giỏ hàng trống</td>
                        </tr>
                    )}
                    {/* ✅ Nút Xóa tất cả */}
                    {cartItems.length > 0 && (
                        <button className="clear-cart-btn" onClick={handleClearCart}>
                            Xóa tất cả
                        </button>
                    )}
                </tbody>
            </table>


            <div className="total">
                <h2>Tạm tính: {cartItems.reduce((acc, item) => acc + (item.gia * item.so_luong), 0).toLocaleString()}đ</h2>
                <button className="checkout-btn" onClick={fetchUserInfo}>
                    Thanh toán
                </button>

            </div>


            {showModal && (
  <div className="modal show">
    <div className="modal-content">
      <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
      <h2 className="modal-title">Chi tiết đơn hàng</h2>

      <form className="customer-info" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Họ và tên</label>
          <input
            type="text"
            placeholder="Nhập họ và tên"
            value={customerName || ""}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          {errors.customerName && <p className="error-message">{errors.customerName}</p>}
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" value={customerEmail || "Chưa có email"} readOnly />
        </div>

        <div className="input-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={customerPhone || ""}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
          {errors.customerPhone && <p className="error-message">{errors.customerPhone}</p>}
        </div>

        <div className="input-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            placeholder="Nhập địa chỉ"
            value={customerAddress || ""}
            onChange={(e) => setCustomerAddress(e.target.value)}
          />
          {errors.customerAddress && <p className="error-message">{errors.customerAddress}</p>}
        </div>

        <DiscountCode totalAmount={totalAmount()} onApplyDiscount={setDiscount} />
      </form>

      <div className="payment-method">
        <h3>Phương thức thanh toán</h3>
        <div className="payment-options">
          {["cash", "zalopay", "vnpay", "momo"].map((method) => (
            <label
              key={method}
              className={`payment-option ${paymentMethod === method ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <span className="label-text">
                {{
                  cash: "Tiền mặt khi nhận hàng",
                  zalopay: "ZaloPay",
                  vnpay: "VNPay",
                  momo: "MoMo",
                }[method]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {orderMessage && <div className="payment-success"><h3>{orderMessage}</h3></div>}

      <div className="modal-footer">
        <div className="order-total">
          <span>Tổng cộng:</span>
          <strong>{totalAmount().toLocaleString()}đ</strong>
        </div>
        <button className="confirm-btn" onClick={handlePayments} disabled={isProcessing}>
          {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </button>
      </div>
    </div>
  </div>
)}


        </div>

    );

}

export default ThanhToan;
