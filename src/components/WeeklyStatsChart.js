import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "./css/WeeklyStatsChart.css";

const WeeklyStatsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/admin/weekly-stats")
      .then((res) => {
        setData(res.data.reverse()); // đảo ngược để hiển thị tuần theo thứ tự tăng dần
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  return (
    <div className="chart-container">
      <h2 className="chart-title">Tổng quan hàng tuần</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#8884d8" name="Người dùng" />
          <Bar dataKey="products" fill="#82ca9d" name="Sản phẩm" />
          <Bar dataKey="orders" fill="#ffc658" name="Đơn hàng" />
          <Bar dataKey="unprocessed" fill="#ff7f50" name="Đơn hàng chưa xử lý" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyStatsChart;
