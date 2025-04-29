import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { week: "Tuần 1", sales: 4000, orders: 240, newUsers: 240, pending: 50 },
  { week: "Tuần 2", sales: 3000, orders: 139, newUsers: 221, pending: 80 },
  { week: "Tuần 3", sales: 2000, orders: 980, newUsers: 229, pending: 40 },
  { week: "Tuần 4", sales: 2780, orders: 390, newUsers: 200, pending: 70 },
];

const Statistics = () => {
  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Thống kê</h2>

      {/* Thẻ thống kê tổng hợp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Tổng doanh thu</p>
          <h3 className="text-2xl font-bold">$15,000</h3>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Tổng đơn hàng</p>
          <h3 className="text-2xl font-bold">1,200</h3>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Người dùng mới</p>
          <h3 className="text-2xl font-bold">300</h3>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Đơn hàng chờ xử lý</p>
          <h3 className="text-2xl font-bold">50</h3>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-gray-900 p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Hiệu suất hàng tuần</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="week" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: "#374151", border: "none" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 8 }}
              name="Doanh thu"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#3B82F6"
              name="Đơn hàng"
            />
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="#F59E0B"
              name="Người dùng mới"
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#EF4444"
              name="Đơn hàng chờ xử lý"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
