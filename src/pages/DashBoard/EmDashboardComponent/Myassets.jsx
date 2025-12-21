// src/components/employee/MyAssets.jsx
import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";

const MyAssets = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = UseAuth();

  const [assignedAssets, setAssignedAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchMyAssets = async () => {
      if (!dbUser?.email) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all assigned assets for this employee
        const res = await axiosSecure.get(`/assigned-assets?employeeEmail=${dbUser.email}`);
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

  // Search + Filter
  useEffect(() => {
    let filtered = assignedAssets;

    if (searchTerm) {
      filtered = filtered.filter((asset) =>
        asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((asset) => asset.assetType === typeFilter);
    }

    setFilteredAssets(filtered);
  }, [searchTerm, typeFilter, assignedAssets]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Assets</h1>
        <p className="text-base-content/70 mt-2">
          All assets assigned to you across companies
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
          <p className="text-2xl text-base-content/60">No assets assigned yet</p>
          <p className="text-base-content/50 mt-2">
            Request assets from your company HR to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset._id} className="card bg-base-100 shadow-xl">
              <figure className="h-48">
                <img
                  src={asset.assetImage}
                  alt={asset.assetName}
                  className="h-full w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">{asset.assetName}</h2>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Company:</span> {asset.companyName}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    <span className={`badge ${
                      asset.assetType === "Returnable" ? "badge-info" : "badge-warning"
                    }`}>
                      {asset.assetType}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Assigned:</span>{" "}
                    {new Date(asset.assignmentDate).toLocaleDateString()}
                  </p>
                  {asset.returnDate && (
                    <p>
                      <span className="font-semibold">Returned:</span>{" "}
                      {new Date(asset.returnDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="card-actions mt-4">
                  <span className={`badge badge-lg w-full text-center ${
                    asset.status === "assigned" ? "badge-success" : "badge-ghost"
                  }`}>
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
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