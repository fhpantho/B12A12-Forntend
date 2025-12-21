import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";

const RequestAsset = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, setMyRequests } = UseAuth();

  const [assets, setAssets] = useState([]);
  const [myRequests, setMyRequestsLocal] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!dbUser?.email) {
        setLoading(false);
        return;
      }

      try {
        const assetsRes = await axiosSecure.get("/assetcollection");
        setAssets(assetsRes.data.data || assetsRes.data || []);

        if (dbUser.role === "EMPLOYEE") {
          const requestsRes = await axiosSecure.get(
            `/asset-requests?email=${dbUser.email}`
          );
          const requests = requestsRes.data.data || requestsRes.data || [];
          setMyRequestsLocal(requests);
          setMyRequests(requests);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load assets or requests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure, dbUser, setMyRequests]);

  /* Get request status — now checks for rejected too */
  const getRequestStatus = (assetId) => {
    const request = myRequests.find(
      (req) => req.assetId.toString() === assetId.toString()
    );
    return request ? request.requestStatus : null;
  };

  const HandleSubmit = async (asset) => {
    // Extra safety: prevent submit if already rejected
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
      const message =
        err.response?.data?.message ||
        "Failed to submit request. You may have already requested this asset.";
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Request an Asset</h1>
          <p className="text-base-content/70 mt-2">
            Select an available company asset and submit a request
          </p>
        </div>

        {assets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-base-content/60">No assets available right now</p>
            <p className="text-base-content/50 mt-2">Check back later or contact HR</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const status = getRequestStatus(asset._id);

              // Determine button style and text
              let buttonClass = "btn-primary";
              let buttonText = "Request Asset";
              let disabled = false;

              if (status === "pending") {
                buttonClass = "btn-warning";
                buttonText = "Pending Approval";
                disabled = true;
              } else if (status === "approved") {
                buttonClass = "btn-success";
                buttonText = "Approved";
                disabled = true;
              } else if (status === "rejected") {
                buttonClass = "btn-error"; // Red button
                buttonText = "Rejected";
                disabled = true;
              }

              return (
                <div
                  key={asset._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <figure className="h-48">
                    <img
                      src={asset.productImage}
                      alt={asset.productName}
                      className="h-full w-full object-cover"
                    />
                  </figure>

                  <div className="card-body">
                    <h2 className="card-title">{asset.productName}</h2>

                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-semibold">Type:</span>{" "}
                        <span className="badge badge-sm">{asset.productType}</span>
                      </p>
                      <p>
                        <span className="font-semibold">Available:</span>{" "}
                        {asset.productQuantity}
                      </p>
                    </div>

                    <div className="card-actions justify-end mt-6">
                      <button
                        className={`btn btn-md ${buttonClass}`}
                        onClick={() => setSelectedAsset(asset)}
                        disabled={disabled}
                      >
                        {buttonText}
                      </button>
                    </div>

                    {status && (
                      <div className="mt-3 text-center">
                        <span
                          className={`badge badge-sm ${
                            status === "pending"
                              ? "badge-warning"
                              : status === "approved"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {selectedAsset && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Request: {selectedAsset.productName}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-base-content/70">
                    Type: <span className="font-medium">{selectedAsset.productType}</span>
                  </p>
                  <p className="text-sm text-base-content/70">
                    Available Quantity:{" "}
                    <span className="font-medium">{selectedAsset.productQuantity}</span>
                  </p>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      Additional Note (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows="4"
                    placeholder="Write why you need this asset..."
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
                <button
                  onClick={() => HandleSubmit(selectedAsset)}
                  className="btn btn-primary"
                >
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