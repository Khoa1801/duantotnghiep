import { useState, useEffect } from "react";
import axios from "axios";
import "../css/lienhe.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactForm = () => {
    const [formData, setFormData] = useState({
      full_name: "",
      address: "",
      phone: "",
      email: "",
      noi_dung: "",
    });
  
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAboutUs, setShowAboutUs] = useState(false);
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        axios
          .get(`http://localhost:3000/userinfo?id=${user.id}`)
          .then(({ data }) => {
            if (data.error) {
              toast.error("Không tìm thấy thông tin khách hàng!");
            } else {
              setFormData({
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
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
  
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!formData.noi_dung) {
        toast.error("Vui lòng nhập nội dung liên hệ!");
        return;
      }
  
      setLoading(true);
  
      try {
        const formDataToSend = new FormData();
        for (let key in formData) {
          formDataToSend.append(key, formData[key]);
        }
  
        if (image) {
          formDataToSend.append("image", image);
        }
  
        const response = await axios.post("http://localhost:3000/lien_he", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
  
        if (response.data.message) {
          toast.success(response.data.message);
        } else {
          toast.success("Gửi liên hệ thành công!");
        }
  
        setFormData({ full_name: "", address: "", phone: "", email: "", noi_dung: "" });
        setImage(null);
        setImagePreview(null);
      } catch (error) {
        console.error("Lỗi gửi liên hệ:", error);
        toast.error("Gửi thất bại, vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="contact-page-container">
      {/* Phần "Về chúng tôi" được đưa lên trên */}
      <div className="about-us-section expanded">
        <h2 className="section-title">Về Công Ty Chúng Tôi</h2>
        
        <div className="company-overview">
          <div className="company-highlight">
            <h3>Giới Thiệu</h3>
            <p>
              Thành lập từ năm 2010, chúng tôi tự hào là một trong những đơn vị tiên phong trong lĩnh vực 
              cung cấp dịch vụ chất lượng cao tại Việt Nam. Với đội ngũ hơn 200 nhân viên giàu kinh nghiệm, 
              chúng tôi đã phục vụ hơn 10,000 khách hàng trên toàn quốc.
            </p>
          </div>
          
          <div className="company-stats">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Năm kinh nghiệm</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Nhân viên</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Khách hàng</span>
            </div>
          </div>
        </div>

        <div className="company-details">
          <div className="detail-column">
            <h3>Tầm Nhìn</h3>
            <p>
              Trở thành tập đoàn đa quốc gia dẫn đầu về chất lượng dịch vụ và đổi mới sáng tạo, 
              mang lại giá trị bền vững cho khách hàng, nhân viên và cộng đồng.
            </p>
            
            <h3>Giá Trị Cốt Lõi</h3>
            <ul>
              <li>Chất lượng dịch vụ vượt trội</li>
              <li>Đạo đức kinh doanh minh bạch</li>
              <li>Đổi mới sáng tạo không ngừng</li>
              <li>Trách nhiệm với cộng đồng</li>
            </ul>
          </div>
          
          <div className="detail-column">
            <h3>Sứ Mệnh</h3>
            <p>
              Cung cấp các giải pháp tối ưu với chi phí hợp lý, mang đến trải nghiệm khách hàng tuyệt vời 
              thông qua đội ngũ chuyên nghiệp và công nghệ tiên tiến.
            </p>
            
            <h3>Thành Tựu</h3>
            <ul>
              <li>Top 10 Doanh nghiệp uy tín 3 năm liền</li>
              <li>Giải thưởng Chất lượng Quốc gia 2022</li>
              <li>Chứng nhận ISO 9001:2015</li>
              <li>Đối tác chiến lược của nhiều tập đoàn lớn</li>
            </ul>
          </div>
        </div>

        <div className="contact-info-section">
          <h3>Thông Tin Liên Hệ</h3>
          <div className="contact-grid">
            <div className="contact-item">
              <i className="icon-location"></i>
              <div>
                <h4>Trụ sở chính</h4>
                <p>Tầng 10, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="icon-phone"></i>
              <div>
                <h4>Điện thoại</h4>
                <p>1900 1234 (Tổng đài) <br /> 0987 654 321 (Hotline)</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="icon-email"></i>
              <div>
                <h4>Email</h4>
                <p>info@company.com <br /> support@company.com</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="icon-time"></i>
              <div>
                <h4>Giờ làm việc</h4>
                <p>Thứ 2 - Thứ 6: 8:00 - 17:00 <br /> Thứ 7: 8:00 - 12:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần liên hệ giữ nguyên */}
      <div className="contact-form-container">
        <h2 className="contact-form-title">Liên hệ hỗ trợ</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Họ tên"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <textarea
            name="noi_dung"
            value={formData.noi_dung}
            onChange={handleChange}
            placeholder="Nội dung"
            required
          ></textarea>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Xem trước ảnh" />
            </div>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
          />

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </div>      
    </div>
  );
};

export default ContactForm;