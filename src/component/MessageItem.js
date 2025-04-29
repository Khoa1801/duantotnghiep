import React from 'react';

const MessageItem = ({ message }) => {
  return (
    <div className="message-item">
      <div className="message-header">
        <strong>{message.full_name || 'Khách hàng'}</strong> ({message.email})
      </div>
      <div className="message-content">
        <p>{message.noi_dung}</p>
      </div>
    </div>
  );
};

export default MessageItem;
