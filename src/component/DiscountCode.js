import { useState, useEffect } from "react";
import "../css/discount.css";

function DiscountCode({ cartItems, totalAmount, userId, onApplyDiscount }) {
    const [discountCode, setDiscountCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [vouchers, setVouchers] = useState([]);

    // Lấy danh sách voucher từ API
    useEffect(() => {
        fetch("http://localhost:3000/vouchers")
            .then((res) => res.json())
            .then((data) => setVouchers(data))
            .catch(() => setErrorMessage("Không thể tải danh sách mã giảm giá!"));
    }, []);

    // Hàm áp dụng mã giảm giá
    const applyDiscount = async (selectedCode = discountCode) => {
        if (!selectedCode) {
            setErrorMessage("Vui lòng nhập hoặc chọn mã giảm giá!");
            return;
        }

        if (!totalAmount || totalAmount <= 0) {
            setErrorMessage("Giỏ hàng trống, không thể áp dụng mã giảm giá!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/apply-voucher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: selectedCode, totalAmount }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Lỗi khi áp dụng mã giảm giá!");

            setDiscountAmount(data.discount);
            onApplyDiscount(data.discount);
            setDiscountCode(selectedCode);
            setErrorMessage("");
        } catch (error) {
            setDiscountAmount(0);
            onApplyDiscount(0);
            setErrorMessage(error.message);
        }
    };

    // Hàm bỏ mã giảm giá
    const removeDiscount = () => {
        setDiscountAmount(0);
        setDiscountCode("");
        onApplyDiscount(0);
        setErrorMessage("");
    };

    return (
        <div className="discount-container">
            <div className="discount-input">
                <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button onClick={() => applyDiscount()}>Áp dụng</button>
                {discountAmount > 0 && (
                    <button className="remove-discount" onClick={removeDiscount}>Bỏ mã giảm giá</button>
                )}
            </div>

            <div className="voucher-list">
                {vouchers.map((voucher) => (
                    <div
                        key={voucher.code}
                        className={`voucher-item ${discountCode === voucher.code ? "selected" : ""}`}
                        onClick={() => applyDiscount(voucher.code)}
                    >
                        <span>{voucher.code} - Giảm {voucher.discount_amount || `${voucher.discount_percentage}%`}</span>
                    </div>
                ))}
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {discountAmount > 0 && (
                <p className="success-message">Bạn được giảm {discountAmount.toLocaleString()}đ!</p>
            )}
        </div>
    );
}

export default DiscountCode;
