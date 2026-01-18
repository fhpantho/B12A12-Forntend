// src/components/employee/MyAssets.jsx
import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";
import LoaderSpinner from "../../../components/LoaderSpinner";

const MyAssets = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = UseAuth();

  const [assignedAssets, setAssignedAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Helper to capitalize strings
  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

  // Fetch assets
  useEffect(() => {
    const fetchMyAssets = async () => {
      if (!dbUser?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosSecure.get(
          `/assigned-assets?employeeEmail=${dbUser.email}`
        );
        const data = res.data.data || res.data || [];
        setAssignedAssets(data);
        setFilteredAssets(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your assets");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, [axiosSecure, dbUser?.email]);

  // Debounced search + filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      let filtered = assignedAssets;

      if (searchTerm) {
        filtered = filtered.filter((asset) =>
          asset.assetName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (typeFilter !== "all") {
        filtered = filtered.filter((asset) => asset.assetType === typeFilter);
      }

      setFilteredAssets(filtered);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, typeFilter, assignedAssets]);

  if (loading) {
    return (
      <LoaderSpinner></LoaderSpinner>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Assets</h1>
        <p className="text-base-content/70 mt-1">
          {filteredAssets.length} assets assigned to you across companies
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by asset name..."
          className="input input-bordered w-full md:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="select select-bordered w-full md:w-64"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl text-base-content/60">No assets found</p>
          <p className="text-base-content/50 mt-2">
            Request assets from your company HR to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <figure className="h-48 bg-gray-100">
                <img
                  src={asset.assetImage || "https://via.placeholder.com/400x300"}
                  alt={asset.assetName || "Asset"}
                  className="h-full w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title text-lg">{asset.assetName || "Unnamed Asset"}</h2>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Company:</span>{" "}
                    {asset.companyName || "Unknown"}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    <span
                      className={`badge ${
                        asset.assetType === "Returnable" ? "badge-info" : "badge-warning"
                      }`}
                    >
                      {asset.assetType || "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Assigned:</span>{" "}
                    {asset.assignmentDate
                      ? new Date(asset.assignmentDate).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <p>
                    <span className="font-semibold">Returned:</span>{" "}
                    {asset.returnDate
                      ? new Date(asset.returnDate).toLocaleDateString()
                      : "Not returned yet"}
                  </p>
                </div>

                <div className="card-actions mt-4">
                  <span
                    className={`badge badge-lg w-full text-center ${
                      asset.status === "assigned" ? "badge-success" : "badge-ghost"
                    }`}
                  >
                    {capitalize(asset.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssets;
