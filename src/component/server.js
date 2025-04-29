const express = require("express");
const router = express.Router();
const querystring = require("querystring");
require("dotenv").config();

router.post("/create_payment_url", (req, res) => {
    let date = new Date();
    let orderId = date.getTime(); // Mã đơn hàng
    let ipAddr = req.ip || "127.0.0.1"; // Địa chỉ IP

    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASHSECRET;
    let returnUrl = process.env.VNP_RETURNURL;
    let orderInfo = "Thanh toan don hang";
    let amount = req.body.amount; // Số tiền từ giỏ hàng
    let bankCode = req.body.bankCode || "";

    let locale = "vn"; 
    let currCode = "VND";
    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "billpayment",
        vnp_Amount: amount * 100, // VNPay yêu cầu nhân 100
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
    };

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    let paymentUrl = process.env.VNP_URL + "?" + querystring.stringify(vnp_Params);
    res.json({ paymentUrl });
});

module.exports = router;
