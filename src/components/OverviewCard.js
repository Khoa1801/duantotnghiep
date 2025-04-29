import React, { useEffect, useState } from "react";
import WeeklyStatsChart from "./WeeklyStatsChart";
import "./css/Overview.css";

const Overview = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:3000/users"),
          fetch("http://localhost:3000/products"),
          fetch("http://localhost:3000/orders2"),
        ]);

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        // Giả sử:
        // usersData là mảng người dùng
        // productsData là mảng sản phẩm
        // ordersData là mảng đơn hàng

        const pendingOrders = ordersData.filter(
          (order) => order.status === "pending"
        ).length;

        const transformedStats = [
          { title: "Người dùng", count: usersData.length },
          { title: "Sản phẩm", count: productsData.length },
          { title: "Đơn hàng", count: ordersData.length },
          { title: "Đơn chưa xử lý", count: pendingOrders },
        ];

        setStats(transformedStats);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overview-page">
      <h2 className="overview-title">Tổng quan hệ thống</h2>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="stat-title">{stat.title}</div>
            <div className="stat-count">{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="chart-wrapper">
        <h3 className="chart-title">Thống kê đơn hàng hàng tuần</h3>
        <WeeklyStatsChart />
      </div>
    </div>
  );
};

export default Overview;