import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icon mới từ react-icons/ai
import '../css/Feedback.css'; // Đảm bảo bạn đã tạo một file Feedback.css

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [hiddenComments, setHiddenComments] = useState({});
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/binhluan")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Lỗi khi lấy bình luận:", error));
  }, []);

  const toggleVisibility = (id) => {
    setHiddenComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteComment = (id) => {
    fetch(`http://localhost:3000/binhluan/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setFeedbacks((prev) => prev.filter((comment) => comment.id !== id));
        }
      })
      .catch((error) => console.error("Lỗi khi xóa bình luận:", error));
  };

  const filteredFeedbacks = filterRating > 0 
    ? feedbacks.filter((feedback) => feedback.rating === filterRating)
    : feedbacks;

  return (
    <div className="feedback-container13">
      <h2 className="title13">Phản hồi & Đánh giá</h2>

      {/* Bộ lọc sao */}
      <div className="rating-filter13">
        <label className="filter-label13">Lọc theo sao:</label>
        <select 
          value={filterRating} 
          onChange={(e) => setFilterRating(Number(e.target.value))} 
          className="filter-select13"
        >
          <option value="0">Tất cả</option>
          <option value="5">5 Sao</option>
          <option value="4">4 Sao</option>
          <option value="3">3 Sao</option>
          <option value="2">2 Sao</option>
          <option value="1">1 Sao</option>
        </select>
      </div>

      <div className="feedback-list13">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item13">
              <div className="feedback-header13">
                <span className="user-info13">User {feedback.user_id}</span>
                <span className="date13">{feedback.created_at}</span>
              </div>

              <div className="feedback-actions13">
                <button onClick={() => toggleVisibility(feedback.id)} className="toggle-visibility13">
                  {hiddenComments[feedback.id] ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>

                <button onClick={() => deleteComment(feedback.id)} className="delete-btn13">
                  <AiOutlineDelete />
                </button>
              </div>

              <div className="rating13">
                <span className="star-rating13">{feedback.rating} ⭐</span>
              </div>

              {!hiddenComments[feedback.id] && <p className="comment13">{feedback.comment}</p>}
            </div>
          ))
        ) : (
          <p className="no-feedback13">Không có phản hồi nào.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
