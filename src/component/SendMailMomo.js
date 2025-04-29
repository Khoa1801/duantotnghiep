const nodemailer = require("nodemailer");

async function sendOrderConfirmationEmail(orderId) {
  try {
    // 1. Lấy thông tin đơn hàng
    const [orderRows] = await db.execute(
      "SELECT * FROM don_hang WHERE id_dh = ?",
      [orderId]
    );
    const order = orderRows[0];

    // 2. Lấy thông tin chi tiết đơn hàng (join với bảng sản phẩm)
    const [details] = await db.execute(
      `SELECT dhct.so_luong, dhct.gia, sp.ten_sp
       FROM don_hang_chi_tiet dhct
       JOIN san_pham sp ON dhct.id_sp = sp.id_sp
       WHERE dhct.id_dh = ?`,
      [orderId]
    );

    // 3. Tạo HTML nội dung email
    let productListHTML = "";
    details.forEach((item) => {
      const total = item.so_luong * item.gia;
      productListHTML += `
        <tr>
          <td>${item.ten_sp}</td>
          <td>${item.so_luong}</td>
          <td>${item.gia.toLocaleString()}đ</td>
          <td>${total.toLocaleString()}đ</td>
        </tr>`;
    });

    const emailHTML = `
      <h2>✅ Đơn hàng của bạn đã được xác nhận!</h2>
      <p><strong>Họ tên:</strong> ${order.ho_ten}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>SĐT:</strong> ${order.sdt}</p>
      <p><strong>Địa chỉ:</strong> ${order.address}</p>
      <p><strong>Phương thức thanh toán:</strong> ${order.phuong_thuc_thanh_toan}</p>
      <p><strong>Ghi chú:</strong> ${order.ghi_chu_don_hang || "Không có"}</p>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          ${productListHTML}
        </tbody>
      </table>
      <p><strong>Tổng thanh toán:</strong> ${order.tong_tien.toLocaleString()}đ</p>
      <p>Cảm ơn bạn đã mua hàng ❤️</p>
    `;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'khanhnnps36583@fpt.edu.vn',
            pass: 'kdco cxmg hpnt mkdu' // Không an toàn, có thể bị lộ!
        }
    });

    await transporter.sendMail({
      from: `"Shop Online" <khanhnnps36583@fpt.edu.vn>`,
      to: order.email,
      subject: "Xác nhận đơn hàng thành công!",
      html: emailHTML,
    });

    console.log("📧 Đã gửi mail xác nhận cho:", order.email);
  } catch (err) {
    console.error("❌ Lỗi gửi mail:", err.message);
  }
}
