import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";
import LoaderSpinner from "../../../components/LoaderSpinner";

/* -------------------- Loader -------------------- */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

/* -------------------- Component -------------------- */
const RequestAsset = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, setMyRequests } = UseAuth();

  const [assets, setAssets] = useState([]);
  const [myRequests, setMyRequestsLocal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState("");

  /* -------------------- Fetch Assets (EMPLOYEE) -------------------- */
  const fetchAssets = async () => {
    if (!dbUser?.email) return;

    try {
      setLoading(true);

      const res = await axiosSecure.get("/employee-assets");


      setAssets(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Fetch My Requests -------------------- */
  const fetchRequests = async () => {
    if (!dbUser?.email || dbUser?.role !== "EMPLOYEE") return;

    try {
      const res = await axiosSecure.get(
        `/asset-requests?email=${dbUser.email}`
      );

      const requests = res.data?.data || [];
      setMyRequestsLocal(requests);
      setMyRequests(requests);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchRequests();
  }, [dbUser]);

  /* -------------------- Helpers -------------------- */
  const getRequestStatus = (assetId) =>
    myRequests.find(
      (req) => req.assetId?.toString() === assetId?.toString()
    )?.requestStatus || null;

  /* -------------------- Submit Request -------------------- */
  const handleSubmit = async (asset) => {
    const status = getRequestStatus(asset._id);

    if (status === "rejected") {
      toast.warning("You cannot request this asset again.");
      setSelectedAsset(null);
      setNote("");
      return;
    }

    try {
      const payload = {
        assetId: asset._id,
        requesterEmail: dbUser.email,
        note: note.trim(),
      };

      await axiosSecure.post("/asset-requests", payload);

      toast.success("Request submitted successfully!");

      const newRequest = {
        _id: Date.now().toString(),
        assetId: asset._id,
        assetName: asset.productName,
        requestStatus: "pending",
        requestDate: new Date().toISOString(),
      };

      const updated = [...myRequests, newRequest];
      setMyRequestsLocal(updated);
      setMyRequests(updated);

      setSelectedAsset(null);
      setNote("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit request";
      toast.error(msg);
    }
  };

  if (loading) return <LoaderSpinner></LoaderSpinner>

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Request an Asset</h1>
          <p className="text-xl text-base-content/70 mt-3">
            Browse available assets and submit a request
          </p>
        </div>

        {/* Assets */}
        {assets.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-2xl">
            <p className="text-2xl text-base-content/60">No assets available</p>
            <p className="text-base text-base-content/50 mt-4">
              Contact HR or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {assets.map((asset) => {
              const status = getRequestStatus(asset._id);

              let btnClass = "btn-primary";
              let btnText = "Request Asset";
              let disabled = false;

              if (status === "pending") {
                btnClass = "btn-warning";
                btnText = "Pending";
                disabled = true;
              } else if (status === "approved") {
                btnClass = "btn-success";
                btnText = "Approved";
                disabled = true;
              } else if (status === "rejected") {
                btnClass = "btn-error";
                btnText = "Rejected";
                disabled = true;
              }

              return (
                <div
                  key={asset._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
                >
                  <figure className="h-48">
                    <img
                      src={asset.productImage || "https://via.placeholder.com/300"}
                      alt={asset.productName}
                      className="w-full h-full object-cover"
                    />
                  </figure>

                  <div className="card-body">
                    <h2 className="card-title">{asset.productName}</h2>

                    <p className="text-sm">
                      <strong>Type:</strong>{" "}
                      <span className="badge badge-sm">
                        {asset.productType}
                      </span>
                    </p>

                    <p className="text-sm">
                      <strong>Available:</strong>{" "}
                      {asset.productQuantity || 0}
                    </p>

                    <button
                      className={`btn mt-4 w-full ${btnClass}`}
                      disabled={disabled}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      {btnText}
                    </button>
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
              <h3 className="font-bold text-xl mb-4">
                Request: {selectedAsset.productName}
              </h3>

              <textarea
                className="textarea textarea-bordered w-full mb-6"
                placeholder="Why do you need this asset? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

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
                  className="btn btn-primary"
                  onClick={() => handleSubmit(selectedAsset)}
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
