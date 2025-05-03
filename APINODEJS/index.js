const express = require('express');
const mysql = require('mysql');
const app = express();
const nodemailer = require ('nodemailer');
const port = 3000;
const fs = require("fs");
const multer = require("multer");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const querystring = require('qs');
const crypto = require("crypto");
const moment = require("moment");
const cors = require("cors");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const vnpayRoute = require("./vnpay"); // hoặc ./routes/vnpay
const paymentZaloRouter = require("./paymentZaloRouter");
const path = require("path");
const momoRouter = require("./create_momo_payment");
require("dotenv").config({ path: "../.env" });  // Chỉ định đường dẫn đến .env
const allowedOrigins = [
    "http://localhost:3500",
    process.env.NGROK_URL // ✅ Lấy URL ngrok từ .env
];

app.use(cors({
    origin: allowedOrigins, // ✅ Định nghĩa danh sách các origin được phép
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  // ✅ Cho phép gửi cookie/token
}));
console.log("NGROK_URL:", process.env.NGROK_URL);
app.use(express.json());
app.use(passport.initialize());
app.use("/", vnpayRoute);
app.use("/momo", momoRouter);
app.use("/zalo", paymentZaloRouter);
const util = require('util');
app.use(express.static(path.join(__dirname, "build")));


// Đảm bảo thư mục 'uploads' tồn tại
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
  


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bangiay2'
});

db.query = util.promisify(db.query);

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});



// const vnp_TmnCode = "IVQS5CJ5";
// const vnp_HashSecret = "KQBGFBBESTDN2RKPEBT1W30YJAWV7MF3";
// const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
// const vnp_ReturnUrl = `${process.env.NGROK_URL}/vnpay_return`;
// const vnp_IpnUrl = `${process.env.NGROK_URL}/vnpay_ipn`;

// function sortObject(obj) {
//   const sorted = {};
//   const keys = Object.keys(obj).sort();
//   for (let key of keys) {
//     sorted[key] = obj[key];
//   }
//   return sorted;
// }

// app.post("/create_payment", (req, res) => {
//     const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
//     let amount = Math.round(Number(req.body.amount));
//     const bankCode = req.body.bankCode || "NCB";
//     const orderInfo = req.body.orderInfo || "Thanh toan don hang";
  
//     if (isNaN(amount) || amount <= 0 || amount % 1 !== 0) {
//       return res.status(400).json({ error: "Số tiền không hợp lệ!" });
//     }
  
//     const createDate = moment().format("YYYYMMDDHHmmss");
//     const orderId = Date.now().toString(); // timestamp dạng "epoch" rất dài và luôn duy nhất
  
//     let vnp_Params = {
//       vnp_Version: "2.1.0",
//       vnp_Command: "pay",
//       vnp_TmnCode,
//       vnp_Locale: "vn",
//       vnp_CurrCode: "VND",
//       vnp_TxnRef: orderId,
//       vnp_OrderInfo: orderInfo,
//       vnp_OrderType: "fashion", // Thay "other"
//       vnp_Amount: amount * 100,
//       vnp_ReturnUrl,
//       vnp_IpAddr: ipAddr,
//       vnp_CreateDate: createDate,
//       vnp_IpnUrl,
//       vnp_BankCode: bankCode,
//     };
  
//     vnp_Params = sortObject(vnp_Params);
  
//     const signData = require('qs').stringify(vnp_Params, { encode: false });
//     const secureHash = crypto.createHmac("sha512", vnp_HashSecret)
//       .update(Buffer.from(signData, "utf-8"))
//       .digest("hex");
  
//     vnp_Params.vnp_SecureHash = secureHash;
  
//     const queryString = querystring.stringify(vnp_Params, { encode: true });
    
//     const paymentUrl = `${vnp_Url}?${queryString}`;
  
//     return res.json({ paymentUrl });
//   });
  
// // 2. Xử lý returnUrl (người dùng được redirect về)
// app.get("/vnpay_return", (req, res) => {
//   const vnp_Params = { ...req.query };
//   const secureHash = vnp_Params.vnp_SecureHash;
//   delete vnp_Params.vnp_SecureHash;

//   const signData = querystring.stringify(sortObject(vnp_Params), { encode: false });
//   const hmac = crypto.createHmac("sha512", vnp_HashSecret);
//   const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   if (secureHash === checkSum) {
//     if (vnp_Params.vnp_ResponseCode === "00") {
//       return res.redirect("http://localhost:5173/payment-result?status=success");
//     } else {
//       return res.redirect("http://localhost:5173/payment-result?status=fail");
//     }
//   } else {
//     return res.redirect("http://localhost:5173/payment-result?status=invalid");
//   }
// });

// // 3. Xử lý IPN từ VNPAY
// app.get("/vnpay_ipn", (req, res) => {
//   const vnp_Params = { ...req.query };
//   const secureHash = vnp_Params.vnp_SecureHash;
//   delete vnp_Params.vnp_SecureHash;

//   const signData = querystring.stringify(sortObject(vnp_Params), { encode: false });
//   const hmac = crypto.createHmac("sha512", vnp_HashSecret);
//   const checkSum = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   if (secureHash === checkSum) {
//     if (vnp_Params.vnp_ResponseCode === "00") {
//       res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
//     } else {
//       res.status(200).json({ RspCode: "00", Message: "Payment Failed" });
//     }
//   } else {
//     res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
//   }
// })

  //////////////////
  // Cấu hình Google OAuth
  // Cấu hình Passport với GoogleStrategy
  passport.use(new GoogleStrategy({
      clientID: "1007085767736-ierk621e10nh03bbb0toismdgpbpvkra.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      const email = emails && emails[0] ? emails[0].value : null;
  
      try {
          if (!email) {
              return done(new Error("Không thể lấy được email từ Google."));
          }
  
          const query = `INSERT INTO users (google_id, name, email) 
                         VALUES (?, ?, ?) 
                         ON DUPLICATE KEY UPDATE name = ?, email = ?`;
  
          await db.query(query, [id, displayName, email, displayName, email]);
  
          const user = { id, name: displayName, email };
          return done(null, user);
      } catch (err) {
          return done(err);
      }
    }
  ));
  
  // Khởi tạo session cho user
  passport.serializeUser((user, done) => {
      done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
      done(null, user);
  });
  
  // Route để đăng nhập bằng Google
  app.get('/auth/google', passport.authenticate('google', { 
      scope: ['profile', 'email'],
      prompt: 'select_account' // Bắt buộc Google hiển thị màn hình chọn tài khoản
  }));
  
  
  // Route callback khi Google xác thực thành công
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }), 
    (req, res) => {
      const user = req.user;
  
      if (!user) {
        return res.redirect('/login');
      }
  
      // Lưu thông tin người dùng vào cookie
      res.cookie('userId', user.id, { httpOnly: false, secure: false, sameSite: 'Lax' });
      res.cookie('userName', user.name, { httpOnly: false, secure: false, sameSite: 'Lax' });
      res.cookie('userEmail', user.email, { httpOnly: false, secure: false, sameSite: 'Lax' });
  
      // Điều hướng về frontend
      res.redirect('http://localhost:3500');
    }
  );
  
    
// Cấu hình Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: '1016940273678342',  // ID của bạn
    clientSecret: 'f40c938e7453821959d6490700075856',  // Secret của bạn
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName'] // Bỏ 'email' đi, chỉ lấy 'id' và 'displayName'
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName } = profile;

    try {
        const query = `INSERT INTO users (facebook_id, name) VALUES (?, ?) 
                       ON DUPLICATE KEY UPDATE name = ?`;
        await db.query(query, [id, displayName, displayName]);

        const user = { id, name: displayName };
        return done(null, user);
    } catch (err) {
        return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Không cần yêu cầu quyền email trong scope nữa
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { 
      failureRedirect: '/login', 
      session: false 
    }), 
    (req, res) => {
      const user = req.user;

      // Thay vì truyền trực tiếp qua URL, mình sẽ lưu vào cookie
      res.cookie('userId', user.id, { 
          httpOnly: false,       // Nếu muốn frontend đọc được thì phải để false
          secure: false,         // Nếu dùng HTTPS thì đặt thành true
          sameSite: 'Lax'        // Giúp tránh các tấn công CSRF, nếu dùng HTTPS thì có thể đổi thành 'Strict'
      });

      res.cookie('userName', user.name, { 
          httpOnly: false,
          secure: false,
          sameSite: 'Lax'
      });

      // ✅ Điều hướng về frontend chạy ở cổng 3500
      res.redirect('http://localhost:3500/');
    }
);


// API: Thêm liên hệ kèm hình ảnh
app.post("/lien_he", upload.single("image"), (req, res) => {
    const { full_name, address, phone, email, noi_dung, user_id } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
  
    const sql = "INSERT INTO lien_he (full_name, address, phone, email, noi_dung, user_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [full_name, address, phone, email, noi_dung, user_id, image], (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm liên hệ:", err);
        return res.status(500).json({ message: "Lỗi khi thêm liên hệ!" });
      }
      res.status(200).json({ message: "Gửi liên hệ thành công!", image });
    });
  });
  
  // API: Lấy danh sách liên hệ
  app.get("/lien_he", (req, res) => {
    db.query("SELECT * FROM lien_he", (err, results) => {
      if (err) return res.status(500).json({ message: "Lỗi truy vấn dữ liệu!" });
      res.status(200).json(results);
    });
  });

  
  app.get('/login', (req, res) => {
    res.send('Trang đăng nhập');
});

// Catch-all route: React entry point
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
  

 
app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    db.query('SELECT * FROM users WHERE phone = ?', [phone], async (err, result) => {
        if (err) return res.status(500).json({ message: 'Lỗi truy vấn CSDL' });
        if (result.length === 0) {
            return res.status(400).json({ message: 'Số điện thoại không tồn tại' });
        }

        const user = result[0];

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Mật khẩu không đúng' });
        }

        // Nếu mật khẩu đúng, trả về thông tin user và role
        res.json({
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                phone: user.phone,
                name: user.full_name,
                role: user.role // Thêm vai trò của người dùng
            }
        });
    });
});
 
db.query("SELECT id, password FROM users", async (err, results) => {
    if (err) throw err;
    
    for (let user of results) {
        if (!user.password.startsWith("$2b$")) {  // Kiểm tra nếu chưa mã hóa
            const hashedPassword = await bcrypt.hash(user.password, 10);
            db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
            console.log(`✅ Đã mã hóa mật khẩu cho user ID: ${user.id}`);
        }
    }
});

app.post("/forgot-password", (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Lỗi truy vấn CSDL" });

        if (result.length === 0) {
            return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
        }

        const user = result[0];
        const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "15m" });

        // Lấy link ngrok từ .env thay vì viết cứng
        const resetLink = `${process.env.NGROK_URL}/reset-password/${token}`;

        // Gửi email
        transporter.sendMail(
            {
                from: "khanhnnps36583@fpt.edu.vn",
                to: email,
                subject: "Đặt lại mật khẩu",
                html: `<h3>Chào bạn,</h3>
                       <p>Nhấn vào link sau để đặt lại mật khẩu:</p>
                       <a href="${resetLink}">${resetLink}</a>
                       <p>Liên kết này sẽ hết hạn sau 15 phút.</p>`,
            },
            (error, info) => {
                if (error) return res.status(500).json({ message: "Lỗi gửi email" });

                res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
            }
        );
    });
});
app.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Kiểm tra token
        const decoded = jwt.verify(token, "SECRET_KEY");

        // Kiểm tra mật khẩu mới có hợp lệ không (ví dụ, độ dài tối thiểu)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự." });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu cho người dùng trong cơ sở dữ liệu
        db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, decoded.id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Lỗi cơ sở dữ liệu." });
                }
                return res.json({ message: "Mật khẩu đã được cập nhật thành công." });
            }
        );
    } catch (error) {
        // Nếu token không hợp lệ hoặc đã hết hạn
        res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
});
  
app.post("/register", (req, res) => {
    const { full_name, phone, email, password } = req.body;
  
    // 1. Kiểm tra đầu vào
    if (!full_name || !phone || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
  
    // 2. Kiểm tra trùng email/số điện thoại
    const checkQuery = "SELECT * FROM users WHERE phone = ? OR email = ?";
    db.query(checkQuery, [phone, email], async (err, results) => {
      if (err) {
        console.error("❌ Lỗi truy vấn kiểm tra:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
  
      if (results.length > 0) {
        return res.status(400).json({
          message: "Số điện thoại hoặc email đã được đăng ký",
        });
      }
  
      try {
        // 3. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // 4. Lưu user vào DB
        const insertQuery = "INSERT INTO users (full_name, phone, email, password) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [full_name, phone, email, hashedPassword], (err, result) => {
          if (err) {
            console.error("❌ Lỗi khi thêm user:", err);
            return res.status(500).json({ message: "Lỗi server khi thêm user" });
          }
  
          // 5. Trả về response
          res.status(201).json({
            message: "Đăng ký thành công",
            user: {
              id: result.insertId,
              full_name,
              phone,
              email,
            },
          });
        });
      } catch (error) {
        console.error("❌ Lỗi mã hóa mật khẩu:", error);
        res.status(500).json({ message: "Lỗi server khi mã hóa mật khẩu" });
      }
    });
  });


// Middleware xác thực token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // lấy token từ header
    if (!token) return res.status(403).json({ message: 'Không có token' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
        req.user = user;
        next();
    });
};

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { full_name, phone, address } = req.body;
  
    if (!full_name || !phone || !address) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }
  
    const sql = "UPDATE users SET full_name = ?, phone = ?, address = ? WHERE id = ?";
    const values = [full_name, phone, address, id];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật người dùng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      res.json({ message: "Cập nhật thành công" });
    });
  });

  
  app.put("/users/:id/change-password", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params; // Lấy user ID từ URL
  
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu thông tin đầu vào" });
    }
  
    try {
      db.query("SELECT password FROM users WHERE id = ?", [id], async (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi truy vấn dữ liệu" });
        if (results.length === 0) return res.status(404).json({ message: "Người dùng không tồn tại" });
  
        const dbPassword = results[0].password;
        
        console.log("Mật khẩu trong DB:", dbPassword); // Debug để kiểm tra DB trả về gì
        console.log("Mật khẩu nhập vào:", oldPassword);
  
        const validPassword = await bcrypt.compare(oldPassword, dbPassword);
        
        if (!validPassword) {
          console.log("So sánh bcrypt thất bại!");
          return res.status(401).json({ message: "Mật khẩu cũ không chính xác" });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
  
        db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id], (updateErr) => {
          if (updateErr) return res.status(500).json({ message: "Lỗi cập nhật mật khẩu" });
          res.json({ message: "Đổi mật khẩu thành công" });
        });
      });
    } catch (error) {
      console.error("Lỗi server:", error);
      res.status(500).json({ message: "Lỗi server", error });
    }
  });
  






// 1️⃣ Lấy danh sách tất cả hình ảnh sản phẩm
app.get('/hinh_san_pham', (req, res) => {
    db.query('SELECT * FROM hinh_anh_san_pham', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2️⃣ Lấy danh sách hình ảnh theo sản phẩm ID
app.get('/hinh_san_pham/:sanpham_id', (req, res) => {
    const { sanpham_id } = req.params;
    db.query('SELECT * FROM hinh_anh_san_pham WHERE sanpham_id = ?', [sanpham_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 3️⃣ Thêm ảnh sản phẩm mới
app.post('/hinh_san_pham', (req, res) => {
    const { sanpham_id, duong_dan, mo_ta } = req.body;

    if (!sanpham_id || !duong_dan) {
        return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc đường dẫn hình ảnh' });
    }

    const sql = 'INSERT INTO hinh_anh_san_pham (sanpham_id, duong_dan, mo_ta, ngay_tao) VALUES (?, ?, ?, NOW())';
    db.query(sql, [sanpham_id, duong_dan, mo_ta], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm hình ảnh:', err);
            return res.status(500).json({ message: 'Lỗi khi thêm hình ảnh' });
        }
        res.json({ message: 'Thêm hình ảnh thành công', image_id: result.insertId });
    });
});

// 4️⃣ Xóa ảnh sản phẩm theo ID
app.delete('/hinh_san_pham/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM hinh_anh_san_pham WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa hình ảnh:', err);
            return res.status(500).json({ message: 'Lỗi khi xóa hình ảnh' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Hình ảnh không tồn tại' });
        }
        res.json({ message: 'Xóa hình ảnh thành công' });
    });
});
app.get('/thong-tin-san-pham', (req, res) => {
    const sql = 'SELECT * FROM thong_tin_san_pham';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Lỗi truy vấn CSDL', error: err });
        } else {
            res.json(result);
        }
    });
});

// 🟢 API: Lấy thông tin sản phẩm theo ID sản phẩm
app.get('/thong-tin-san-pham/:sanpham_id', (req, res) => {
    const { sanpham_id } = req.params;
    const sql = 'SELECT * FROM thong_tin_san_pham WHERE sanpham_id = ?';

    db.query(sql, [sanpham_id], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Lỗi truy vấn CSDL', error: err });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            } else {
                res.json(result);
            }
        }
    });
});

// 🛍 API PRODUCTS (Giữ nguyên phần này)
/// Lấy tất cả sản phẩm
app.get('/products', (req, res) => {
    db.query('SELECT * FROM san_pham', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Lấy sản phẩm theo ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM san_pham WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Sản phẩm không tồn tại');
        res.json(result[0]);
    });
});

// Thêm sản phẩm mới
app.post('/products', (req, res) => {
    const { ten_sp, slug, gia_goc, gia_khuyen_mai, so_luong, id_loai, ngay, hinh, hot, luot_xem, an_hien, tinh_chat, mo_ta, mau_sac, size } = req.body;
    const sql = `INSERT INTO san_pham (ten_sp, slug, gia_goc, gia_khuyen_mai, so_luong, id_loai, ngay, hinh, hot, luot_xem, an_hien, tinh_chat, mo_ta, mau_sac, size) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [ten_sp, slug, gia_goc, gia_khuyen_mai, so_luong, id_loai, ngay, hinh, hot, luot_xem, an_hien, tinh_chat, mo_ta, mau_sac, size], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// Cập nhật sản phẩm
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { ten_sp, slug, gia_goc, gia_khuyen_mai, so_luong, id_loai, ngay, hinh, hot, luot_xem, an_hien, tinh_chat, mo_ta, mau_sac, size } = req.body;
    const sql = `UPDATE san_pham 
                 SET ten_sp = ?, slug = ?, gia_goc = ?, gia_khuyen_mai = ?, so_luong = ?, id_loai = ?, ngay = ?, hinh = ?, hot = ?, luot_xem = ?, an_hien = ?, tinh_chat = ?, mo_ta = ?, mau_sac = ?, size = ? 
                 WHERE id = ?`;
    db.query(sql, [ten_sp, slug, gia_goc, gia_khuyen_mai, so_luong, id_loai, ngay, hinh, hot, luot_xem, an_hien, tinh_chat, mo_ta, mau_sac, size, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Sản phẩm không tồn tại');
        res.json({ id, ...req.body });
    });
});

// Xóa sản phẩm
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM san_pham WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Sản phẩm không tồn tại');
        res.json({ message: 'Sản phẩm đã được xóa thành công' });
    });
});

// 📌 Lấy danh sách loại sản phẩm
app.get('/loai', (req, res) => {
    const sql = 'SELECT * FROM loai ORDER BY thu_tu ASC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 Lấy chi tiết loại sản phẩm theo ID
app.get('/loai/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM loai WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: 'Loại sản phẩm không tồn tại' });
        res.json(result[0]);
    });
});
app.get('/sptrongloai/:id_loai', (req, res) => {
    let id_loai = parseInt(req.params.id_loai);
    if (isNaN(id_loai) || id_loai <= 0) {
        return res.status(400).json({ message: "ID loại không hợp lệ" });
    }

    let sql = `SELECT id, ten_sp, gia_goc, gia_khuyen_mai, hinh FROM san_pham 
               WHERE id_loai = ? AND an_hien = 1 ORDER BY id DESC`;

    db.query(sql, [id_loai], (err, data) => {
        if (err) return res.status(500).json({ message: "Lỗi lấy sản phẩm", error: err });
        res.json(data);
    });
});

app.get('/loai/:id_loai/sanpham', (req, res) => {
    const id_loai = parseInt(req.params.id_loai);
    
    if (isNaN(id_loai) || id_loai <= 0) {
        return res.status(400).json({ message: "ID loại không hợp lệ" });
    }

    // Truy vấn thông tin loại sản phẩm
    const sqlLoai = `SELECT id, ten_loai FROM loai WHERE id = ? AND an_hien = 1`;

    db.query(sqlLoai, [id_loai], (err, loaiData) => {
        if (err) return res.status(500).json({ message: "Lỗi truy vấn loại sản phẩm", error: err });

        if (loaiData.length === 0) {
            return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
        }

        // Truy vấn danh sách sản phẩm thuộc loại đó
        const sqlSanPham = `SELECT id, ten_sp, gia_goc, gia_khuyen_mai, hinh, ngay FROM san_pham WHERE id_loai = ? AND an_hien = 1 ORDER BY id DESC`;

        db.query(sqlSanPham, [id_loai], (err, sanPhamData) => {
            if (err) return res.status(500).json({ message: "Lỗi truy vấn sản phẩm", error: err });

            res.json({ loai: loaiData[0], san_pham: sanPhamData });
        });
    });
});

  
// Route để lấy sản phẩm theo danh mục
app.get('/danhmuc/:id/products', (req, res) => {
    const categoryId = req.params.id; // Lấy id danh mục từ URL

    // Truy vấn lấy sản phẩm của danh mục theo categoryId
    let sqlSanPham = `SELECT id, ten_sp, gia_goc, gia_khuyen_mai, hinh, ngay FROM san_pham WHERE id_loai = ? AND an_hien = 1 ORDER BY id DESC`;

    db.query(sqlSanPham, [categoryId], (err, sanPhamData) => {
        if (err) {
            return res.status(500).json({ "thongbao": "Lỗi truy vấn sản phẩm", "error": err });
        }

        if (sanPhamData.length === 0) {
            return res.status(404).json({ "thongbao": "Không có sản phẩm nào trong danh mục này" });
        }

        res.json({ san_pham: sanPhamData });
    });
});

app.get('/danhmuc', (req, res) => {
    let sqlLoai = `SELECT id, ten_loai FROM loai ORDER BY thu_tu ASC`;

    db.query(sqlLoai, (err, loaiData) => {
        if (err) {
            return res.status(500).json({ "thongbao": "Lỗi truy vấn danh mục", "error": err });
        }

        if (loaiData.length === 0) {
            return res.status(404).json({ "thongbao": "Không có danh mục nào" });
        }

        let danhMucPromise = loaiData.map(loai => {
            return new Promise((resolve, reject) => {
                let sqlSanPham = `SELECT id, ten_sp, gia_goc, gia_khuyen_mai, hinh, ngay, luot_xem FROM san_pham WHERE id_loai = ? AND an_hien = 1 ORDER BY id DESC`;
                
                db.query(sqlSanPham, [loai.id], (err, sanPhamData) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ ...loai, san_pham: sanPhamData });
                    }
                });
            });
        });

        Promise.all(danhMucPromise)
            .then(danhmuc => res.json(danhmuc))
            .catch(error => res.status(500).json({ "thongbao": "Lỗi truy vấn sản phẩm", "error": error }));
    });
});


// 📌 Thêm loại sản phẩm mới
app.post('/loai', (req, res) => {
    const { ten_loai, slug, thu_tu, an_hien } = req.body;
    const sql = 'INSERT INTO loai (ten_loai, slug, thu_tu, an_hien, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
    db.query(sql, [ten_loai, slug, thu_tu, an_hien], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ten_loai, slug, thu_tu, an_hien });
    });
});

// 📌 Cập nhật loại sản phẩm theo ID
app.put('/loai/:id', (req, res) => {
    const { id } = req.params;
    const { ten_loai, slug, thu_tu, an_hien } = req.body;
    const sql = 'UPDATE loai SET ten_loai = ?, slug = ?, thu_tu = ?, an_hien = ?, updated_at = NOW() WHERE id = ?';
    db.query(sql, [ten_loai, slug, thu_tu, an_hien, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Loại sản phẩm không tồn tại' });
        res.json({ id, ten_loai, slug, thu_tu, an_hien });
    });
});

// 📌 Xóa loại sản phẩm theo ID
app.delete('/loai/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM loai WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Loại sản phẩm không tồn tại' });
        res.json({ message: 'Loại sản phẩm đã được xóa' });
    });
});


// 📝 Lấy danh sách bài viết blog
app.get('/blog', (req, res) => {
    db.query('SELECT * FROM blog WHERE an_hien = 1 ORDER BY ngay_dang DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 📝 Lấy chi tiết bài viết theo ID
app.get('/blog/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM blog WHERE id = ? AND an_hien = 1', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).json({ message: 'Bài viết không tồn tại' });
        res.json(result[0]);
    });
});

// 📝 Thêm bài viết mới
app.post('/blog', (req, res) => {
    const { tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien } = req.body;
    const sql = `INSERT INTO blog (tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// 📝 Cập nhật bài viết
app.put('/blog/:id', (req, res) => {
    const { id } = req.params;
    const { tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien } = req.body;
    const sql = `UPDATE blog 
                 SET tieu_de = ?, slug = ?, mo_ta = ?, noi_dung = ?, hinh = ?, id_loai = ?, an_hien = ? 
                 WHERE id = ?`;
    db.query(sql, [tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Bài viết không tồn tại');
        res.json({ id, ...req.body });
    });
});

// 📝 Xóa bài viết
app.delete('/blog/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM blog WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Bài viết không tồn tại');
        res.json({ message: 'Bài viết đã được xóa' });
    });
});

// 📰 API Tin Tức

// Lấy danh sách tin tức
app.get('/tin_tuc', (req, res) => {
    db.query('SELECT id, tieu_de, hinh_anh, ngay_dang FROM tin_tuc ORDER BY ngay_dang DESC', (err, results) => {
        if (err) return res.status(500).send(err);
        
        // Tạo link trỏ tới blog
        const newsWithLinks = results.map(news => ({
            ...news,
            blog_link: `/post/${news.id}`
        }));

        res.json(newsWithLinks);
    });
});

// 📌 Lấy chi tiết tin tức theo ID
app.get('/tin_tuc/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tin_tuc WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).json({ message: 'Tin tức không tồn tại' });
        res.json(result[0]);
    });
});

// 📌 Thêm tin tức mới
app.post('/tin_tuc', (req, res) => {
    const { tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien } = req.body;
    const sql = `INSERT INTO tin_tuc (tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, ngay_dang) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
    db.query(sql, [tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// 📌 Cập nhật tin tức
app.put('/tin_tuc/:id', (req, res) => {
    const { id } = req.params;
    const { tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien } = req.body;
    const sql = `UPDATE tin_tuc 
                 SET tieu_de = ?, slug = ?, mo_ta = ?, noi_dung = ?, hinh = ?, id_loai = ?, ngay_dang = NOW() 
                 WHERE id = ?`;
    db.query(sql, [tieu_de, slug, mo_ta, noi_dung, hinh, id_loai, an_hien, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Tin tức không tồn tại');
        res.json({ id, ...req.body });
    });
});

// 📌 Xóa tin tức
app.delete('/tin_tuc/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tin_tuc WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Tin tức không tồn tại');
        res.json({ message: 'Tin tức đã được xóa' });
    });
});

// 📌 Tìm kiếm sản phẩm
app.get('/timkiem', (req, res) => {
    const keyword = req.query.keyword?.trim();
    if (!keyword) return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });

    const sql = `SELECT id, ten_sp, gia_goc, gia_khuyen_mai, hinh 
                 FROM san_pham 
                 WHERE ten_sp LIKE ? OR slug LIKE ? 
                 ORDER BY id DESC`;
    
    db.query(sql, [`%${keyword}%`, `%${keyword}%`], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi tìm kiếm", error: err });
        res.json(results);
    });
});

// 2. Lấy danh sách giỏ hàng của user
app.get("/giohang/:id_user", (req, res) => {
    const { id_user } = req.params;
    const sql = "SELECT * FROM gio_hang WHERE id_user = ?";

    db.query(sql, [id_user], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi lấy giỏ hàng", details: err });
        }
        res.json(result);
    });
});

app.put("/giohang/:id_user/:id_sp", (req, res) => {
    const { id_user, id_sp } = req.params;
    const { so_luong } = req.body;

    if (!so_luong || so_luong < 1) {
        return res.status(400).json({ error: "Số lượng không hợp lệ!" });
    }

    const sql = "UPDATE gio_hang SET so_luong = ? WHERE id_user = ? AND id_sp = ?";
    db.query(sql, [so_luong, id_user, id_sp], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi cập nhật số lượng", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sản phẩm không tồn tại trong giỏ hàng!" });
        }
        res.json({ message: "Cập nhật số lượng thành công!" });
    });
});

// API lấy đơn hàng theo ID
app.get("/orders/:id", (req, res) => {
    const orderId = req.params.id;
  
    // Lấy thông tin đơn hàng
    const sqlOrder = "SELECT * FROM don_hang WHERE id_dh = ?";
    db.query(sqlOrder, [orderId], (err, result) => {
      if (err) {
        console.error("Lỗi lấy đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
      }
  
      const order = result[0];
  
      // Lấy danh sách sản phẩm trong đơn hàng
      const sqlItems = `
      SELECT 
        san_pham.ten_sp AS product, 
        don_hang_chi_tiet.so_luong, 
        san_pham.gia_khuyen_mai AS gia_goc, 
        san_pham.hinh AS hinh, 
        don_hang.tong_tien AS tong_tien
      FROM don_hang_chi_tiet 
      JOIN san_pham ON don_hang_chi_tiet.id_sp = san_pham.id 
      JOIN don_hang ON don_hang_chi_tiet.id_dh = don_hang.id_dh 
      WHERE don_hang_chi_tiet.id_dh = ?;
    `;
    
  
      db.query(sqlItems, [orderId], (err, items) => {
        if (err) {
          console.error("Lỗi lấy sản phẩm:", err);
          return res.status(500).json({ message: "Lỗi server" });
        }
  
        // Tính tổng tiền đơn hàng
        const totalAmount = items.reduce((sum, item) => sum + item.so_luong * item.gia_goc, 0);
  
        res.json({
          ...order, // Thông tin đơn hàng
          items, // Danh sách sản phẩm
          tong_tien: totalAmount, // Tổng tiền đơn hàng
        });
      });
    });
  });
  app.get("/order/total/:id", (req, res) => {
    const orderId = req.params.id;
    const sql = "SELECT tong_tien FROM don_hang WHERE id_dh = ?";
  
    db.query(sql, [orderId], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
      }
  
      // Kiểm tra nếu không có dữ liệu
      if (results.length === 0) {
        return res.json({ tong_tien: 0 });
      }
  
      res.json({ tong_tien: results[0].tong_tien });
    });
  });

  app.get("/userinfo", (req, res) => {
    const { email, id } = req.query;
    if (!email && !id) return res.status(400).json({ error: "Thiếu email hoặc id" });

    let sql = "SELECT * FROM users WHERE " + (email ? "email = ?" : "id = ?");
    let param = email || id;

    db.query(sql, [param], (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi server" });
        res.json(results.length ? results[0] : { error: "Không tìm thấy user" });
    });
});



// 4. Xóa một sản phẩm khỏi giỏ hàng
app.delete("/giohang/:id_user/:id_sp", (req, res) => {
    const { id_user, id_sp } = req.params;
    console.log("Yêu cầu xóa sản phẩm:", { id_user, id_sp });

    const sql = "DELETE FROM gio_hang WHERE id_user = ? AND id_sp = ?";
    db.query(sql, [id_user, id_sp], (err, result) => {
        if (err) {
            console.error("Lỗi xóa sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi xóa sản phẩm", details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm trong giỏ hàng!" });
        }

        res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công!" });
    });
});

app.get('/binhluan/:product_id', (req, res) => {
    const { product_id } = req.params;

    db.query( "SELECT * FROM comments WHERE product_id = ? ORDER BY created_at DESC"
        , [product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
        }
        res.json(results);
    });
});
// API thêm bình luận (Chỉ cho phép nếu đã mua)
app.post("/add-comment", async (req, res) => {
    const { user_id, product_id, comment, rating } = req.body;

    if (!user_id || !product_id || !comment || !rating) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    try {
        // Kiểm tra xem user đã mua sản phẩm chưa
        const checkPurchaseQuery = `
            SELECT 1 FROM don_hang_chi_tiet dhct
            JOIN don_hang dh ON dhct.id_dh = dh.id_dh  -- Đã sửa từ 'dh.id' thành 'dh.id_dh'
            WHERE dh.id_user = ? AND dhct.id_sp = ? AND dhct.da_mua = 1
        `;
        const checkPurchase = await db.query(checkPurchaseQuery, [user_id, product_id]);

        if (checkPurchase.length === 0) {
            return res.status(403).json({ message: "Bạn chỉ có thể bình luận sản phẩm đã mua!" });
        }

        // Nếu đã mua, cho phép thêm bình luận
        const sql = `INSERT INTO comments (user_id, product_id, comment, rating, created_at) 
                     VALUES (?, ?, ?, ?, NOW())`;

        const result = await db.query(sql, [user_id, product_id, comment, rating]);

        res.status(201).json({ message: "Bình luận đã được thêm!", commentId: result.insertId });
    } catch (err) {
        console.error("Lỗi server:", err);
        res.status(500).json({ message: "Lỗi server!", error: err });
    }
});

app.get("/check-purchase", async (req, res) => {
    const { user_id, product_id } = req.query;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: "Thiếu thông tin user_id hoặc product_id!" });
    }

    try {
        const checkPurchaseQuery = `
            SELECT 1 FROM don_hang_chi_tiet dhct
            JOIN don_hang dh ON dhct.id_dh = dh.id_dh
            WHERE dh.id_user = ? AND dhct.id_sp = ? AND dhct.da_mua = 1
        `;
        const [rows] = await db.query(checkPurchaseQuery, [user_id, product_id]);

        if (rows.length === 0) {
            return res.status(403).json({ message: "Bạn chưa mua sản phẩm này!" });
        }

        res.json({ message: "Bạn đã mua sản phẩm này!" });
    } catch (err) {
        console.error("Lỗi server:", err);
        res.status(500).json({ message: "Lỗi server!", error: err });
    }
});


app.post("/giohang", (req, res) => {
    const { id_user, id_sp, tensp, gia, img, so_luong, size, color } = req.body;

    if (!id_user || !id_sp || !tensp || !gia || !img || !so_luong || !size || !color) {
        return res.status(400).json({ error: "Thiếu dữ liệu sản phẩm hoặc người dùng" });
    }

    const checkSql = "SELECT * FROM gio_hang WHERE id_user = ? AND id_sp = ? AND size = ? AND color = ?";
    db.query(checkSql, [id_user, id_sp, size, color], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi kiểm tra giỏ hàng", details: err });
        }

        if (result.length > 0) {
            // Nếu sản phẩm đã có, cập nhật số lượng
            const updateSql = "UPDATE gio_hang SET so_luong = so_luong + ? WHERE id_user = ? AND id_sp = ? AND size = ? AND color = ?";
            db.query(updateSql, [so_luong, id_user, id_sp, size, color], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Lỗi cập nhật giỏ hàng", details: err });
                }
                res.json({ message: "Cập nhật số lượng thành công!" });
            });
        } else {
            // Nếu chưa có, thêm mới
            const insertSql = "INSERT INTO gio_hang (id_user, id_sp, tensp, gia, img, so_luong, size, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(insertSql, [id_user, id_sp, tensp, gia, img, so_luong, size, color], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Lỗi thêm vào giỏ hàng", details: err });
                }
                res.json({ message: "Thêm vào giỏ hàng thành công!", id: result.insertId });
            });
        }
    });
});
app.get("/sanpham/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT id, ten_sp, mau_sac, size, gia_khuyen_mai, hinh FROM san_pham WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi truy vấn", details: err });
      if (result.length === 0) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
      res.json(result[0]);
    });
  });
  
  
app.get("/orders", (req, res) => {
    const { id_user } = req.query; // Lấy id_user từ query params

    if (!id_user) {
        return res.status(400).json({ error: "Thiếu id_user" });
    }

    const sql = "SELECT * FROM don_hang WHERE id_user = ?";
    db.query(sql, [id_user], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi lấy đơn hàng", details: err });
        }
        res.json(results);
    });
});

app.post('/orders', async (req, res) => {
    const {
        ho_ten,
        email,
        sdt,
        address,
        tong_tien,
        discountCode,
        id_user,
        products,
        paymentMethod // thêm từ client gửi lên: 'cod', 'momo', 'zalopay', 'vnpay'
    } = req.body;

    if (!ho_ten || !email || !sdt || !address || !products || products.length === 0 || !paymentMethod) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin, phương thức thanh toán và danh sách sản phẩm!" });
    }

    let discountAmount = 0;
    let voucherId = null;
    const thoi_diem_mua = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Kiểm tra mã giảm giá
        if (discountCode) {
            const vouchers = await db.query(
                "SELECT id, discount_amount, discount_percentage, max_discount FROM voucher WHERE code = ? AND status = 'active' AND expiry_date > NOW()",
                [discountCode]
            );

            if (vouchers.length === 0) {
                return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" });
            }

            const { id, discount_amount, discount_percentage, max_discount } = vouchers[0];
            voucherId = id;
            discountAmount = discount_percentage
                ? Math.min((tong_tien * discount_percentage) / 100, max_discount || Infinity)
                : discount_amount || 0;

            await db.query("INSERT INTO user_discounts (id_user, voucher_id) VALUES (?, ?)", [id_user, voucherId]);
        }

        const finalAmount = tong_tien - discountAmount;

        // Xác định trạng thái thanh toán
        const trang_thai_thanh_toan = (paymentMethod === 'momo' || paymentMethod === 'zalopay') ? 'da_thanh_toan' : 'chua_thanh_toan';

        // Lưu đơn hàng
        const result = await db.query(
            "INSERT INTO don_hang (id_user, thoi_diem_mua, ho_ten, email, sdt, address, tong_tien, trang_thai, phuong_thuc_thanh_toan, trang_thai_thanh_toan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id_user, thoi_diem_mua, ho_ten, email, sdt, address, finalAmount, 'cho_xu_ly', paymentMethod, trang_thai_thanh_toan]
        );

        const orderId = result.insertId;

        // Lưu chi tiết đơn hàng
        for (const product of products) {
            if (product.so_luong > 0) {
                await db.query(
                    "INSERT INTO don_hang_chi_tiet (id_dh, id_sp, so_luong, gia, da_mua, size, color) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [orderId, product.id_sp, product.so_luong, product.gia, 1, product.size, product.color]
                );

                await db.query(
                    "UPDATE san_pham SET so_luong = so_luong - ? WHERE id = ?",
                    [product.so_luong, product.id_sp]
                );
            }
        }

        // Xóa giỏ hàng
        await db.query("DELETE FROM gio_hang WHERE id_user = ?", [id_user]);

        return res.status(201).json({ message: "Đơn hàng đã được lưu thành công!", orderId });
    } catch (err) {
        console.error("Lỗi:", err);
        return res.status(500).json({ message: "Lỗi khi xử lý đơn hàng!", error: err });
    }
});


app.get('/purchased-products/:id_user', async (req, res) => {
    const { id_user } = req.params;
    try {
        const products = await db.query(
            `SELECT dhct.id_sp, sp.ten_san_pham 
            FROM don_hang_chi_tiet dhct
            JOIN don_hang dh ON dhct.id_dh = dh.id
            JOIN san_pham sp ON dhct.id_sp = sp.id
            WHERE dh.id_user = ? AND dhct.da_mua = 1`,
            [id_user]
        );
        res.json(products);
    } catch (err) {
        console.error("Lỗi:", err);
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm đã mua", error: err });
    }
});


app.get("/vouchers", (req, res) => {
    const query = "SELECT code, discount_amount, discount_percentage FROM voucher WHERE status = 'active'";
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi lấy danh sách voucher:", err);
            return res.status(500).json({ error: "Lỗi server", details: err.message });
        }
        
        if (!results.length) {
            return res.status(404).json({ error: "Không có voucher nào khả dụng!" });
        }

        res.json(results);
    });
});

app.post("/apply-voucher", (req, res) => {
    const { code, totalAmount } = req.body;

    if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({ error: "Giỏ hàng trống, không thể áp dụng mã giảm giá!" });
    }

    if (!code) return res.status(400).json({ error: "Vui lòng nhập mã giảm giá!" });

    const query = "SELECT * FROM voucher WHERE code = ? AND status = 'active' AND expiry_date > NOW()";

    db.query(query, [code], (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi kiểm tra voucher:", err);
            return res.status(500).json({ error: "Lỗi server" });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" });
        }

        const voucher = results[0];

        if (totalAmount < voucher.min_order_amount) {
            return res.status(400).json({ error: `Đơn hàng tối thiểu phải từ ${voucher.min_order_amount}đ` });
        }

        let discount = voucher.discount_amount || (totalAmount * voucher.discount_percentage) / 100;
        if (voucher.max_discount) discount = Math.min(discount, voucher.max_discount);

        res.json({ discount });
    });
});

// 5. Xóa toàn bộ giỏ hàng của user
app.delete("/giohang/:id_user", (req, res) => {
    const { id_user } = req.params;

    const sql = "DELETE FROM gio_hang WHERE id_user = ?";
    db.query(sql, [id_user], (err) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi xóa giỏ hàng", details: err });
        }
        res.json({ message: "Xóa toàn bộ giỏ hàng thành công!" });
    });
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'khanhnnps36583@fpt.edu.vn',
        pass: 'kdco cxmg hpnt mkdu' // Không an toàn, có thể bị lộ!
    }
});

app.get('/send-email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: 'khanhnnps36583@fpt.edu.vn',
            to: 'khoav5004@gmail.com',
            subject: 'My Subject',
            html: '<h1>hiiiiiiii</h1>'
        });
        res.send('Email sent successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending email');
    }
});
// API gửi email xác nhận đơn hàng
app.post("/send-email", async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).json({ error: "Thiếu thông tin email!" });
    }

    try {
        await transporter.sendMail({
            from: 'khanhnnps36583@fpt.edu.vn', // Tên người gửi
            to: 'khoav5004@gmail.com',
            subject: subject,
            html: message, // Nội dung HTML
        });

        res.json({ success: true, message: "✅ Email đã được gửi thành công!" });
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
        res.status(500).json({ error: "Không thể gửi email" });
    }
});


app.post("/admin/update-weekly-stats", (req, res) => {
    const sql = `
      INSERT INTO weekly_stats (week_number, year, users, products, orders, unprocessed)
      SELECT 
        WEEK(dh.thoi_diem_mua, 1) AS week_number,
        YEAR(dh.thoi_diem_mua) AS year,
        COUNT(DISTINCT dh.id_user) AS users,
        COUNT(DISTINCT ct.id_sp) AS products,
        COUNT(DISTINCT dh.id_dh) AS orders,
        SUM(CASE WHEN dh.trang_thai = 'chưa xử lý' THEN 1 ELSE 0 END) AS unprocessed
      FROM don_hang dh
      JOIN don_hang_chi_tiet ct ON dh.id_dh = ct.id_dh
      GROUP BY WEEK(dh.thoi_diem_mua, 1), YEAR(dh.thoi_diem_mua)
      ON DUPLICATE KEY UPDATE 
        users = VALUES(users),
        products = VALUES(products),
        orders = VALUES(orders),
        unprocessed = VALUES(unprocessed)
    `;
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật:", err);
        return res.status(500).json({ error: "Lỗi khi cập nhật thống kê." });
      }
      res.json({ message: "Đã cập nhật thống kê hàng tuần thành công." });
    });
  });
  
  
  app.get("/admin/weekly-stats", (req, res) => {
    const sql = `
      SELECT 
        CONCAT('Week ', week_number) AS week,
        users,
        products,
        orders,
        unprocessed
      FROM weekly_stats
      ORDER BY year DESC, week_number DESC
      LIMIT 4
    `;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", err);
        return res.status(500).json({ error: "Lỗi khi truy vấn thống kê." });
      }
      res.json(results);
    });
  });
  
  // API lấy đơn hàng theo ID
app.get('/order', (req, res) => {
    db.query('SELECT * FROM don_hang ', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get("/orders2", (req, res) => {
    const sqlQuery = `
      SELECT 
        don_hang.id_dh, 
        don_hang.thoi_diem_mua, 
        don_hang.tong_tien, 
        don_hang.trang_thai, 
        don_hang_chi_tiet.id_ct, 
        don_hang_chi_tiet.id_sp, 
        san_pham.ten_sp AS product_name, 
        don_hang_chi_tiet.so_luong AS quantity, 
        don_hang_chi_tiet.gia AS price, 
        don_hang_chi_tiet.da_mua AS purchased, 
        don_hang_chi_tiet.size, 
        don_hang_chi_tiet.color
      FROM don_hang
      JOIN don_hang_chi_tiet ON don_hang.id_dh = don_hang_chi_tiet.id_dh
      JOIN san_pham ON don_hang_chi_tiet.id_sp = san_pham.id
      ORDER BY don_hang.id_dh;  -- Lấy tất cả đơn hàng, không phải chỉ một đơn hàng
    `;
    
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error("Error fetching order details:", err);
        return res.status(500).json({ message: "Server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      res.json(results);  // Trả về tất cả các đơn hàng và chi tiết đơn hàng
    });
  });
      

  app.put("/orders/:orderId/details/:orderDetailId", (req, res) => {
    const { orderId, orderDetailId } = req.params;  // Lấy id đơn hàng và id chi tiết đơn hàng từ URL
    const { quantity, price, size, color } = req.body;  // Lấy thông tin cần cập nhật từ body của yêu cầu
  
    // Kiểm tra xem tất cả các trường có tồn tại không
    if (!quantity || !price) {
      return res.status(400).json({ message: "Số lượng và giá là bắt buộc" });
    }
  
    // Câu lệnh SQL để cập nhật chi tiết đơn hàng
    const sqlQuery = `
      UPDATE don_hang_chi_tiet
      SET 
        so_luong = ?, 
        gia = ?, 
        size = ?, 
        color = ?
      WHERE id_dh = ? AND id_ct = ?
    `;
  
    // Thực thi câu lệnh SQL với các tham số đã được truyền vào
    db.query(sqlQuery, [quantity, price, size, color, orderId, orderDetailId], (err, result) => {
      if (err) {
        console.error("Error updating order details:", err);
        return res.status(500).json({ message: "Server error" });
      }
  
      // Kiểm tra nếu không có bản ghi nào được cập nhật
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Chi tiết đơn hàng không tồn tại" });
      }
  
      res.json({ message: "Cập nhật chi tiết đơn hàng thành công" });
    });
  });
  

app.get("/orders/:id", (req, res) => {
    const orderId = req.params.id;
  
    // Lấy thông tin đơn hàng
    const sqlOrder = "SELECT * FROM don_hang WHERE id_dh = ?";
    db.query(sqlOrder, [orderId], (err, result) => {
      if (err) {
        console.error("Lỗi lấy đơn hàng:", err);
        return res.status(500).json({ message: "Lỗi server" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
      }
  
      const order = result[0];
  
      // Lấy danh sách sản phẩm trong đơn hàng
      const sqlItems = `
      SELECT 
        san_pham.ten_sp AS product, 
        don_hang_chi_tiet.so_luong, 
        san_pham.gia_khuyen_mai AS gia_goc, 
        san_pham.hinh AS hinh, 
        don_hang.tong_tien AS tong_tien
      FROM don_hang_chi_tiet 
      JOIN san_pham ON don_hang_chi_tiet.id_sp = san_pham.id 
      JOIN don_hang ON don_hang_chi_tiet.id_dh = don_hang.id_dh 
      WHERE don_hang_chi_tiet.id_dh = ?;
    `;
    
  
      db.query(sqlItems, [orderId], (err, items) => {
        if (err) {
          console.error("Lỗi lấy sản phẩm:", err);
          return res.status(500).json({ message: "Lỗi server" });
        }
  
        // Tính tổng tiền đơn hàng
        const totalAmount = items.reduce((sum, item) => sum + item.so_luong * item.gia_goc, 0);
  
        res.json({
          ...order, // Thông tin đơn hàng
          items, // Danh sách sản phẩm
          tong_tien: totalAmount, // Tổng tiền đơn hàng
        });
      });
    });
  });
  app.get("/order/total/:id", (req, res) => {
    const orderId = req.params.id;
    const sql = "SELECT tong_tien FROM don_hang WHERE id_dh = ?";
  
    db.query(sql, [orderId], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
      }
  
      // Kiểm tra nếu không có dữ liệu
      if (results.length === 0) {
        return res.json({ tong_tien: 0 });
      }
  
      res.json({ tong_tien: results[0].tong_tien });
    });
  });

  app.get("/userinfo", (req, res) => {
    const { email, id } = req.query;
    if (!email && !id) return res.status(400).json({ error: "Thiếu email hoặc id" });

    let sql = "SELECT * FROM users WHERE " + (email ? "email = ?" : "id = ?");
    let param = email || id;

    db.query(sql, [param], (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi server" });
        res.json(results.length ? results[0] : { error: "Không tìm thấy user" });
    });
});



// 4. Xóa một sản phẩm khỏi giỏ hàng
app.delete("/giohang/:id_user/:id_sp", (req, res) => {
    const { id_user, id_sp } = req.params;
    console.log("Yêu cầu xóa sản phẩm:", { id_user, id_sp });

    const sql = "DELETE FROM gio_hang WHERE id_user = ? AND id_sp = ?";
    db.query(sql, [id_user, id_sp], (err, result) => {
        if (err) {
            console.error("Lỗi xóa sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi xóa sản phẩm", details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Không tìm thấy sản phẩm trong giỏ hàng!" });
        }

        res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công!" });
    });
});

app.get('/binhluan/:product_id', (req, res) => {
    const { product_id } = req.params;

    db.query('SELECT * FROM comments WHERE product_id = ?', [product_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
        }
        res.json(results);
    });
});

// 1. Thêm sản phẩm vào giỏ hàng (nếu có thì cập nhật số lượng)
app.post("/giohang", (req, res) => {
    const { id_user, id_sp, tensp, gia, img, so_luong } = req.body;

    if (!id_user || !id_sp || !tensp || !gia || !img || !so_luong) {
        return res.status(400).json({ error: "Thiếu dữ liệu sản phẩm hoặc người dùng" });
    }

    const checkSql = "SELECT * FROM gio_hang WHERE id_user = ? AND id_sp = ?";
    db.query(checkSql, [id_user, id_sp], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi kiểm tra giỏ hàng", details: err });
        }

        if (result.length > 0) {
            // Nếu sản phẩm đã có, cập nhật số lượng
            const updateSql = "UPDATE gio_hang SET so_luong = so_luong + ? WHERE id_user = ? AND id_sp = ?";
            db.query(updateSql, [so_luong, id_user, id_sp], (err) => {
                if (err) {
                    return res.status(500).json({ error: "Lỗi cập nhật giỏ hàng", details: err });
                }
                res.json({ message: "Cập nhật số lượng thành công!" });
            });
        } else {
            // Nếu chưa có, thêm mới
            const insertSql = "INSERT INTO gio_hang (id_user, id_sp, tensp, gia, img, so_luong) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertSql, [id_user, id_sp, tensp, gia, img, so_luong], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Lỗi thêm vào giỏ hàng", details: err });
                }
                res.json({ message: "Thêm vào giỏ hàng thành công!", id: result.insertId });
            });
        }
    });
});
app.get("/orders", (req, res) => {
    const { id_user } = req.query; // Lấy id_user từ query params

    if (!id_user) {
        return res.status(400).json({ error: "Thiếu id_user" });
    }

    const sql = "SELECT * FROM don_hang WHERE id_user = ?";
    db.query(sql, [id_user], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi lấy đơn hàng", details: err });
        }
        res.json(results);
    });
});

app.get("/vouchers", (req, res) => {
    const query = "SELECT id, code, discount_amount, discount_percentage, status,start_date FROM voucher"; // Thêm FROM voucher

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi lấy danh sách voucher:", err);
            return res.status(500).json({ error: "Lỗi server", details: err.message });
        }

        if (results.length === 0) { // Sửa !results.length thành results.length === 0
            return res.status(404).json({ error: "Không có voucher nào khả dụng!" });
        }

        res.json(results);
    });
});




// Xóa voucher theo ID
app.delete("/vouchers/:id", (req, res) => {
    const { id } = req.params;
  
    const sql = "DELETE FROM voucher WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi xóa voucher", details: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy voucher để xóa" });
      }
  
      res.json({ message: `Xóa voucher ${id} thành công!` });
    });
  });

  app.post("/vouchers", (req, res) => {
    const { code, discount_amount, start_date, expiry_date } = req.body;

    console.log("Dữ liệu nhận từ client:", req.body); // Debug dữ liệu đầu vào

    // Kiểm tra nếu thiếu thông tin bắt buộc
    if (!code || !discount_amount || !expiry_date || !start_date) {
        return res.status(400).send({ error: "Thiếu thông tin voucher" });
    }

    // Lấy ngày hiện tại (currentDate)
    const currentDate = new Date().toISOString().split("T")[0]; // Chỉ lấy phần ngày từ định dạng ISO

    // SQL Query để thêm voucher vào database
    const sql = "INSERT INTO voucher (code, discount_amount, start_date, status, expiry_date) VALUES (?, ?, ?, 'active', ?)";

    // Thực thi truy vấn SQL
    db.query(sql, [code, discount_amount, currentDate, expiry_date], (err, result) => {
        if (err) {
            console.error("Lỗi SQL:", err); // In lỗi SQL ra console
            return res.status(500).send({ error: "Lỗi khi thêm voucher", details: err.message });
        }

        // Trả về kết quả thành công
        res.send({
            id: result.insertId,
            code,
            discount_amount,
            start_date: currentDate,
            status: "active",
            expiry_date,  // Trả về expiry_date trong response
        });
    });
});


app.put('/vouchers/:id', (req, res) => {
    const { id } = req.params;
    const { code, discount_amount, discount_percentage, status, start_date } = req.body;

    const sql = `UPDATE voucher 
                 SET code = ?, discount_amount = ?, discount_percentage = ?, status = ?, start_date = ? 
                 WHERE id = ?`;

    db.query(sql, [code, discount_amount, discount_percentage, status, start_date, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Voucher không tồn tại');
        res.json({ id, ...req.body });
    });
});

app.get('/binhluan', (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
        }
        res.json(results);
    });
});
app.delete('/binhluan/:id', (req, res) => {
    const { id } = req.params;

    // Kiểm tra nếu ID không hợp lệ
    if (!id) {
        return res.status(400).json({ error: "Thiếu ID bình luận" });
    }

    // Thực hiện truy vấn xóa bình luận
    db.query('DELETE FROM comments WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi xóa bình luận" });
        }

        // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Bình luận không tồn tại" });
        }

        res.json({ message: "Xóa bình luận thành công" });
    });
});


app.get("/vouchers", (req, res) => {
    const query = "SELECT id, code, discount_amount, discount_percentage, status,start_date FROM voucher"; // Thêm FROM voucher

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Lỗi lấy danh sách voucher:", err);
            return res.status(500).json({ error: "Lỗi server", details: err.message });
        }

        if (results.length === 0) { // Sửa !results.length thành results.length === 0
            return res.status(404).json({ error: "Không có voucher nào khả dụng!" });
        }

        res.json(results);
    });
});

app.get('/lienhe', (req, res) => {
    db.query('SELECT * FROM lien_he', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
        }
        res.json(results);
    });
});

// API trả lời tin nhắn
app.post("/traloi", (req, res) => {
    const { email, reply } = req.body;
  
    if (!email || !reply) {
      return res.status(400).json({ message: "Email và nội dung không được để trống!" });
    }
  
    const sql = "INSERT INTO replies (email, reply) VALUES (?, ?)";
    db.query(sql, [email, reply], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lưu phản hồi!", error: err });
      }
      res.status(201).json({ message: "Gửi phản hồi thành công!", data: { id: result.insertId, email, reply } });
    });
  });

  app.get('/messages', (req, res) => {
    const { id_user, email } = req.query; // Lấy tham số từ query string
  
    if (!id_user || !email) {
      return res.status(400).json({ message: 'Thiếu id_user hoặc email!' });
    }
  
    const sql = `
      SELECT m.id, m.email, m.noi_dung, m.is_admin, m.created_at 
      FROM messages m
      WHERE m.id_user = ? AND m.email = ?
      ORDER BY m.created_at DESC
    `;
  
    db.query(sql, [id_user, email], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy tin nhắn:", err);
        return res.status(500).json({ message: 'Lỗi khi lấy tin nhắn!' });
      }
      res.json(results);
    });
  });
  

// API Lấy danh sách khách hàng
app.get('/customers', (req, res) => {
    const sql = `SELECT id, full_name, email, phone, address, role, created_at FROM users`;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách khách hàng:", err);
            return res.status(500).json({ error: 'Lỗi khi lấy danh sách khách hàng!' });
        }
        res.json(results);
    });
});

app.get('/customers/:id', (req, res) => {
    const userId = req.params.id;  // Lấy ID từ URL
    // Giả sử bạn dùng `userId` để lấy thông tin người dùng từ database
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng!" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
      }
      res.json(result[0]);
    });
  });
  

  app.post('/messages', (req, res) => {
    const { email, noi_dung, id_user } = req.body;

    if (!id_user || !email || !noi_dung) {
        return res.status(400).json({ error: 'ID người dùng, email và nội dung không được để trống!' });
    }

    // Kiểm tra xem email có phải của admin không
    const checkAdminSql = `SELECT role FROM users WHERE email = ? LIMIT 1`;
    db.query(checkAdminSql, [email], (err, result) => {
        if (err) {
            console.error("❌ Lỗi kiểm tra quyền admin:", err);
            return res.status(500).json({ error: 'Lỗi kiểm tra quyền admin!' });
        }

        const isAdmin = result.length > 0 && result[0].role === 'admin' ? 1 : 0;

        // Chèn tin nhắn vào database
        const insertMessageSql = `INSERT INTO messages (email, noi_dung, is_admin, id_user) VALUES (?, ?, ?, ?)`;
        db.query(insertMessageSql, [email, noi_dung, isAdmin, id_user], (err, messageResult) => {
            if (err) {
                console.error("❌ Database error:", err.sqlMessage);
                return res.status(500).json({ error: err.sqlMessage || 'Lỗi khi thêm tin nhắn!' });
            }
            res.status(201).json({ 
                message: '✅ Tin nhắn đã được gửi!', 
                id: messageResult.insertId,
                is_admin: isAdmin 
            });
        });
    });
});




// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  app.get('/users/:id/role', (req, res) => {
    const { id } = req.params;
  
    db.query('SELECT role FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userRole = results[0].role;

      return res.json({ role: userRole }); // 🔥 trả đúng role từ DB
    });
});

  
  

  // DELETE role người dùng
app.delete("/users/:id/role", (req, res) => {
    const userId = req.params.id;
  
    const sql = "UPDATE users SET role = NULL WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa role:", err);
        return res.status(500).json({ message: "Lỗi server khi xóa vai trò." });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
  
      res.json({ message: "Xóa vai trò thành công." });
    });
  });
  
  // Get user by ID
  app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0] || {});
    });
  });
  
  // Create a new user
  app.post('/users', (req, res) => {
    const { full_name, address, phone, email, password, role } = req.body;
    const created_at = new Date();
    const query = 'INSERT INTO users (full_name, address, phone, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [full_name, address, phone, email, password, role, created_at], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId });
    });
  });
  
  // Update a user
  app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { full_name, address, phone, email, password, role } = req.body;
    const query = 'UPDATE users SET full_name = ?, address = ?, phone = ?, email = ?, password = ?, role = ? WHERE id = ?';
    db.query(query, [full_name, address, phone, email, password, role, id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User updated' });
    });
  });
  
  // Delete a user
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User deleted' });
    });
  });

  
  app.put("/order/:id", (req, res) => {
    const orderId = req.params.id;
    const { trang_thai } = req.body; // Lấy trạng thái mới từ request body

    // Danh sách trạng thái hợp lệ
    const validStatus = ["cho_xu_ly", "dang_xu_ly", "da_giao", "hoan_tat"];

    // Kiểm tra trạng thái hợp lệ
    if (!validStatus.includes(trang_thai)) {
        return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    const sql = "UPDATE don_hang SET trang_thai = ? WHERE id_dh = ?";
  
    db.query(sql, [trang_thai, orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi cập nhật đơn hàng" });
        }
        return res.json({ message: `Trạng thái đơn hàng đã được cập nhật thành ${trang_thai}` });
    });
});

app.delete("/order/:id", (req, res) => {
    const orderId = req.params.id;

    const sql = "DELETE FROM don_hang WHERE id_dh = ?";
    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error("Lỗi khi xóa đơn hàng:", err);
            return res.status(500).json({ error: "Lỗi khi xóa đơn hàng" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Đơn hàng không tồn tại" });
        }
        res.json({ message: "Xóa đơn hàng thành công" });
    });
});

app.put("/update-orders", (req, res) => {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000); // Lấy thời gian 1 phút trước
  
    const sql = `
      UPDATE don_hang 
      SET trang_thai = 'da_giao' 
      WHERE trang_thai = 'dang_xu_ly' 
      AND updated_at <= ?
    `;
  
    db.query(sql, [oneMinuteAgo], (err, result) => {
      if (err) {
        console.error("❌ Lỗi khi cập nhật đơn hàng:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }
  
      if (result.affectedRows > 0) {
        res.json({ success: true, message: "✅ Đã cập nhật trạng thái đơn hàng!" });
      } else {
        res.json({ success: false, message: "❌ Không có đơn hàng cần cập nhật!" });
      }
    });
  });

  app.get('/products/:id_loai', (req, res) => {
    const { id_loai } = req.params;

    // Kiểm tra id_loai có hợp lệ không
    if (isNaN(id_loai)) {
        return res.status(400).json({ message: "id_loai phải là số" });
    }

    const sql = "SELECT * FROM san_pham WHERE id_loai = ?";
    
    db.query(sql, [id_loai], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi server", error: err });
        }

        // Kiểm tra nếu không có sản phẩm nào thuộc loại này
        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm nào thuộc loại này" });
        }

        res.json(results);
    });
});



module.exports = db;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


