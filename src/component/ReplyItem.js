import React from 'react';

const ReplyItem = ({ reply }) => {
  return (
    <div className="reply-item">
      <p><strong>Phản hồi:</strong> {reply}</p>
    </div>
  );
};

export default ReplyItem;
