const crypto = require('crypto');
const querystring = require('qs');

const config = {
    vnp_TmnCode: "IVQS5CJ5",
    vnp_HashSecret: "KQBGFBBESTDN2RKPEBT1W30YJAWV7MF3",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "http://localhost:3000/api/vnpay/callback"
};

const createPaymentUrl = (orderId, amount) => {
    let date = new Date();
    let createDate = date.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

    let orderInfo = `Thanh toán đơn hàng #${orderId}`;
    let orderType = "billpayment";
    let locale = "vn";

    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: config.vnp_TmnCode,
        vnp_Amount: amount * 100, // VNPAY yêu cầu nhân 100
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Locale: locale,
        vnp_ReturnUrl: config.vnp_ReturnUrl,
        vnp_CreateDate: createDate
    };

    // Sắp xếp tham số theo thứ tự A-Z
    vnp_Params = Object.fromEntries(Object.entries(vnp_Params).sort());

    // Tạo query string
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params.vnp_SecureHash = signed;

    return `${config.vnp_Url}?${querystring.stringify(vnp_Params, { encode: false })}`;
};
    
module.exports = { createPaymentUrl };
