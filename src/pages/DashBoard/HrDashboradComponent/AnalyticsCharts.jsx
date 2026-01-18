import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";
import LoaderSpinner from "../../../components/LoaderSpinner";

const AnalyticsCharts = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, user } = UseAuth(); // ✅ get user to access Firebase token

  const [typeData, setTypeData] = useState([]);
  const [topRequested, setTopRequested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!dbUser?.email || !user) return;

      try {
        setLoading(true);

        // ✅ get fresh Firebase token
        const token = await user.getIdToken(true);

        // Fetch asset type distribution
        const typeRes = await axiosSecure.get(
          `/analytics/asset-types?hrEmail=${dbUser.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const distribution = typeRes.data.data || { Returnable: 0, "Non-returnable": 0 };
        setTypeData([
          { name: "Returnable", value: distribution.Returnable },
          { name: "Non-returnable", value: distribution["Non-returnable"] },
        ]);

        // Fetch top 5 requested assets
        const topRes = await axiosSecure.get(
          `/analytics/top-requested?hrEmail=${dbUser.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTopRequested(topRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [axiosSecure, dbUser?.email, user]);

  const COLORS = ["#10b981", "#f59e0b"]; // Green for Returnable, Amber for Non-returnable

  if (loading) {
    return (
     <LoaderSpinner></LoaderSpinner>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Pie Chart: Asset Type Distribution */}
      <div className="card bg-base-100 shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Asset Type Distribution
        </h3>
        {typeData.every((item) => item.value === 0) ? (
          <div className="text-center py-16 text-base-content/60">
            <p className="text-xl">No assets added yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart: Top 5 Most Requested */}
      <div className="card bg-base-100 shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Top 5 Most Requested Assets
        </h3>
        {topRequested.length === 0 ? (
          <div className="text-center py-16 text-base-content/60">
            <p className="text-xl">No requests yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topRequested} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                angle={-30}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requestCount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
