import React from "react";

const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5 className="card-title">Tổng sản phẩm</h5>
              <p className="card-text display-6">50</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">120</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text display-6">75</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
