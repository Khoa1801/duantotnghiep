const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3500"], // Chấp nhận cả 2 frontend
        methods: ["GET", "POST"]
    }
});


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'khoav5004@gmail.com',
        pass: 'kdco cxmg hpnt mkdu' // Không an toàn, có thể bị lộ!
    }
});
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3500"], // Chấp nhận nhiều frontend
    methods: ["GET", "POST"],
    credentials: true // Cho phép gửi cookie/session
}));


app.get('/send-email', async (req, res) => {
    try {
        await transporter.sendMail({
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


app.post("/send-email", async (req, res) => {
    const { to, subject, html } = req.body;

    try {
        await transporter.sendMail({
            from: "khoav5004@gmail.com",
            to:"khoavdps29957@fpt.edu.vn",
            subject:"Đơn hàng đã được đặt",
            html:"cảm ơn đã đặt hàng",
        });
        res.status(200).send("Email sent successfully");
    } catch (error) {
        console.error("Lỗi gửi email:", error);
        res.status(500).send("Error sending email");
    }
});
// Chạy server
server.listen(5000, () => {
    console.log("🚀 Server đang chạy tại http://localhost:5000");
});
