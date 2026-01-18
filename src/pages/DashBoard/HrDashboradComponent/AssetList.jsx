import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AnalyticsCharts from "./AnalyticsCharts";
import LoaderSpinner from "../../../components/LoaderSpinner";

const MySwal = withReactContent(Swal);

const AssetList = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, user } = UseAuth(); // user from Firebase

  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productQuantity: "",
    productImage: "",
  });

  // Fetch assets
  const fetchAssets = async (search = "") => {
    if (!user) return;
    try {
      const token = await user.getIdToken(true); // get fresh Firebase token
      const res = await axiosSecure.get("/assetcollection", {
        params: { email: dbUser?.email, search },
        headers: {
          Authorization: `Bearer ${token}`, // standard header
        },
      });
      setAssets(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load assets");
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user, dbUser?.email]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => fetchAssets(searchTerm), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setFormData({
      productName: asset.productName,
      productQuantity: asset.productQuantity,
      productImage: asset.productImage,
    });
  };

  const handleUpdate = async () => {
    if (!formData.productName || !formData.productQuantity || !formData.productImage) {
      toast.error("All fields are required");
      return;
    }

    try {
      const token = await user.getIdToken(true);
      await axiosSecure.patch(
        `/assetcollection/${editingAsset._id}`,
        {
          ...formData,
          productQuantity: Number(formData.productQuantity),
          hrEmail: dbUser.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Asset updated successfully!");
      setEditingAsset(null);
      fetchAssets(searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update asset");
    }
  };

  const handleDelete = async (asset) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${asset.productName}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = await user.getIdToken(true);
      await axiosSecure.delete(`/assetcollection/${asset._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { hrEmail: dbUser.email },
      });
      toast.success("Asset deleted successfully!");
      setAssets((prev) => prev.filter((a) => a._id !== asset._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete asset");
    }
  };

  if (loading) {
    return (
      <LoaderSpinner></LoaderSpinner>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">My Assets</h1>
      <p className="text-base-content/70 mb-6">Manage all assets added to your company</p>

      <AnalyticsCharts />

      <input
        type="text"
        placeholder="Search by asset name..."
        className="input input-bordered w-full max-w-md mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date Added</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-base-content/60">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset._id}>
                  <td>
                    <div className="avatar">
                      <div className="w-16 rounded">
                        <img src={asset.productImage} alt={asset.productName} />
                      </div>
                    </div>
                  </td>
                  <td>{asset.productName}</td>
                  <td>
                    <span
                      className={`badge ${
                        asset.productType === "Returnable" ? "badge-info" : "badge-warning"
                      }`}
                    >
                      {asset.productType}
                    </span>
                  </td>
                  <td>{asset.productQuantity}</td>
                  <td>{new Date(asset.dateAdded).toLocaleDateString()}</td>
                  <td className="text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(asset)} className="btn btn-sm btn-ghost text-info">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(asset)} className="btn btn-sm btn-ghost text-error">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingAsset && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Asset</h3>
            <input
              type="text"
              className="input input-bordered w-full mb-2"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
            <input
              type="number"
              className="input input-bordered w-full mb-2"
              value={formData.productQuantity}
              onChange={(e) => setFormData({ ...formData, productQuantity: e.target.value })}
            />
            <input
              type="url"
              className="input input-bordered w-full mb-2"
              value={formData.productImage}
              onChange={(e) => setFormData({ ...formData, productImage: e.target.value })}
            />
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setEditingAsset(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AssetList;
