import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";

const RequestAsset = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, setMyRequests } = UseAuth();

  const [assets, setAssets] = useState([]);
  const [myRequests, setMyRequestsLocal] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [limit, setLimit] = useState(10); // Configurable page size
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState("");

  const fetchAssets = async (page = 1, newLimit = limit) => {
    try {
      setLoading(true);
      const res = await axiosSecure.get(
        `/assetcollection?page=${page}&limit=${newLimit}`
      );
      setAssets(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (error) {
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(1, limit);

    if (dbUser?.role === "EMPLOYEE" && dbUser?.email) {
      const fetchRequests = async () => {
        try {
          const res = await axiosSecure.get(`/asset-requests?email=${dbUser.email}`);
          const requests = res.data.data || [];
          setMyRequestsLocal(requests);
          setMyRequests(requests);
        } catch (err) {
          console.error(err);
        }
      };
      fetchRequests();
    }
  }, [axiosSecure, dbUser, setMyRequests]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchAssets(newPage, limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchAssets(1, newLimit); // Reset to page 1
  };

  const getRequestStatus = (assetId) => {
    const request = myRequests.find(
      (req) => req.assetId.toString() === assetId.toString()
    );
    return request ? request.requestStatus : null;
  };

  const HandleSubmit = async (asset) => {
    const status = getRequestStatus(asset._id);
    if (status === "rejected") {
      toast.warning("You cannot request this asset again after rejection.");
      setSelectedAsset(null);
      setNote("");
      return;
    }

    try {
      const assetreq = {
        assetId: asset._id,
        requesterEmail: dbUser.email,
        note: note.trim(),
      };

      await axiosSecure.post("/asset-requests", assetreq);

      toast.success("Request submitted successfully!");

      const newRequest = {
        _id: Date.now().toString(),
        assetId: asset._id,
        assetName: asset.productName,
        requestStatus: "pending",
        requestDate: new Date().toISOString(),
      };

      const updatedRequests = [...myRequests, newRequest];
      setMyRequestsLocal(updatedRequests);
      setMyRequests(updatedRequests);

      setSelectedAsset(null);
      setNote("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit request";
      toast.error(message);
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
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Request an Asset</h1>
          <p className="text-xl text-base-content/70 mt-3">
            Browse available assets and submit a request
          </p>
        </div>

        {assets.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-2xl">
            <p className="text-3xl text-base-content/60">No assets available</p>
            <p className="text-lg text-base-content/50 mt-4">
              Check back later or contact your HR
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {assets.map((asset) => {
                const status = getRequestStatus(asset._id);

                let buttonClass = "btn-primary";
                let buttonText = "Request Asset";
                let disabled = false;

                if (status === "pending") {
                  buttonClass = "btn-warning";
                  buttonText = "Pending";
                  disabled = true;
                } else if (status === "approved") {
                  buttonClass = "btn-success";
                  buttonText = "Approved";
                  disabled = true;
                } else if (status === "rejected") {
                  buttonClass = "btn-error";
                  buttonText = "Rejected";
                  disabled = true;
                }

                return (
                  <div
                    key={asset._id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                  >
                    <figure className="h-48">
                      <img
                        src={asset.productImage}
                        alt={asset.productName}
                        className="w-full h-full object-cover"
                      />
                    </figure>

                    <div className="card-body">
                      <h2 className="card-title text-lg">{asset.productName}</h2>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          <span className="badge badge-sm">{asset.productType}</span>
                        </p>
                        <p>
                          <span className="font-medium">Available:</span> {asset.productQuantity}
                        </p>
                      </div>

                      <div className="card-actions mt-6">
                        <button
                          className={`btn w-full ${buttonClass}`}
                          onClick={() => setSelectedAsset(asset)}
                          disabled={disabled}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls with Configurable Limit */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
              {/* Page Size Selector */}
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">Show:</span>
                <select
                  className="select select-bordered w-32"
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-lg">per page</span>
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn btn-outline"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`btn btn-sm ${
                        pagination.currentPage === i + 1
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>

              {/* Total Items */}
              <p className="text-lg">
                Total: <strong>{pagination.totalItems}</strong> assets
              </p>
            </div>
          </>
        )}

        {/* Request Modal */}
        {selectedAsset && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-xl mb-4">
                Request: {selectedAsset.productName}
              </h3>

              <div className="space-y-4 mb-6">
                <p>
                  <strong>Type:</strong> {selectedAsset.productType}
                </p>
                <p>
                  <strong>Available:</strong> {selectedAsset.productQuantity}
                </p>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Additional Note (Optional)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows="4"
                    placeholder="Why do you need this asset?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setSelectedAsset(null);
                    setNote("");
                  }}
                >
                  Cancel
                </button>
                <button onClick={() => HandleSubmit(selectedAsset)} className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default RequestAsset;