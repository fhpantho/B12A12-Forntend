import React from "react";

const Statistics = () => {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Statistics</h1>
          <p className="text-base-content/70 mt-2">
            Overview of asset management performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-lg font-semibold">Total Employees</h2>
              <p className="text-4xl font-bold text-primary mt-2">124</p>
              <p className="text-sm text-base-content/60 mt-1">
                Active company members
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-lg font-semibold">Total Assets</h2>
              <p className="text-4xl font-bold text-secondary mt-2">356</p>
              <p className="text-sm text-base-content/60 mt-1">
                Registered assets
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-lg font-semibold">Assigned Assets</h2>
              <p className="text-4xl font-bold text-success mt-2">289</p>
              <p className="text-sm text-base-content/60 mt-1">
                Currently in use
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-lg font-semibold">Pending Requests</h2>
              <p className="text-4xl font-bold text-warning mt-2">17</p>
              <p className="text-sm text-base-content/60 mt-1">
                Awaiting approval
              </p>
            </div>
          </div>
        </div>

        {/* Extra Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-semibold mb-4">Asset Health</h2>
              <ul className="space-y-2 text-base-content/70">
                <li>✔️ Operational Assets: 310</li>
                <li>⚠️ Under Maintenance: 28</li>
                <li>❌ Retired Assets: 18</li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-semibold mb-4">Request Summary</h2>
              <ul className="space-y-2 text-base-content/70">
                <li>🕒 Pending: 17</li>
                <li>✅ Approved: 142</li>
                <li>❌ Rejected: 9</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
