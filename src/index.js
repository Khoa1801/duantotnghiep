import React from 'react';
import ReactDOM from 'react-dom/client';  // Import react-dom/client thay vì react-dom
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Sử dụng createRoot để tạo root
root.render(
  <BrowserRouter>  {/* Bọc toàn bộ ứng dụng trong BrowserRouter */}
    <App />
  </BrowserRouter>
);
