import React, { useEffect, useState, useCallback } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AllRequests = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, user } = UseAuth(); // ✅ get 'user' to access token

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRequests = useCallback(async () => {
    if (!dbUser?.email || !user) return;

    try {
      // ✅ get fresh Firebase token
      const token = await user.getIdToken(true);

      // ✅ attach token in Authorization header
      const res = await axiosSecure.get(`/asset-requests?email=${dbUser.email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data || res.data || [];
      setRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, dbUser?.email, user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Search + Filter
  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.assetName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.requestStatus === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  // APPROVE HANDLER
  const handleApprove = async (requestId, assetName, employeeName) => {
    const result = await MySwal.fire({
      title: "Approve Asset Request?",
      html: `
        <div class="text-left">
          <p>You are about to assign:</p>
          <p class="font-bold text-lg mt-2">${assetName}</p>
          <p>to</p>
          <p class="font-bold text-lg">${employeeName}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken(true);

      await axiosSecure.patch(`/asset-request/approve/${requestId}`, {
        hrEmail: dbUser.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`${assetName} approved and assigned to ${employeeName}!`);

      // Optimistic update
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, requestStatus: "approved" } : req
        )
      );
    } catch (err) {
      const message = err.response?.data?.message || "Failed to approve request";
      toast.error(message);
    }
  };

  // REJECT HANDLER
  const handleReject = async (requestId) => {
    try {
      const token = await user.getIdToken(true);

      await axiosSecure.patch(`/asset-request/reject/${requestId}`, {
        hrEmail: dbUser.email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Request rejected successfully");

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, requestStatus: "rejected" } : req
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
    }
  };

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
        <h1 className="text-3xl font-bold">All Asset Requests</h1>
        <p className="text-base-content/70 mt-2">Review and manage employee asset requests</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by employee or asset name..."
          className="input input-bordered w-full md:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select select-bordered w-full md:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Employee</th>
              <th>Asset</th>
              <th>Request Date</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-base-content/60">
                  No requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req._id} className="hover">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                          <span className="text-sm">
                            {req.requesterName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{req.requesterName}</div>
                        <div className="text-sm text-base-content/60">{req.requesterEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium">{req.assetName}</td>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge badge-lg ${
                        req.requestStatus === "pending"
                          ? "badge-warning"
                          : req.requestStatus === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {req.requestStatus.charAt(0).toUpperCase() + req.requestStatus.slice(1)}
                    </span>
                  </td>
                  <td className="text-center">
                    {req.requestStatus === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            handleApprove(req._id, req.assetName, req.requesterName)
                          }
                          className="btn btn-sm btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="btn btn-sm btn-error"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-base-content/50">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;
