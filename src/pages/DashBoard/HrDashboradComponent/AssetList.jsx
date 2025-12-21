import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

// Import SweetAlert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AssetList = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = UseAuth();

  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productQuantity: "",
    productImage: "",
  });

  useEffect(() => {
    fetchAssets();
  }, [axiosSecure, dbUser?.email]);

  const fetchAssets = async (search = "") => {
    try {
      const res = await axiosSecure.get("/assetcollection", {
        params: { email: dbUser?.email, search },
      });
      setAssets(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load assets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAssets(searchTerm);
    }, 500);
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
      await axiosSecure.patch(`/assetcollection/${editingAsset._id}`, {
        ...formData,
        productQuantity: Number(formData.productQuantity),
        hrEmail: dbUser.email,
      });

      toast.success("Asset updated successfully!");
      setEditingAsset(null);
      fetchAssets(searchTerm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update asset");
    }
  };

  // SweetAlert2 Delete Confirmation
  const handleDelete = async (asset) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${asset.productName}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return; // User canceled
    }

    try {
      await axiosSecure.delete(`/assetcollection/${asset._id}`, {
        data: { hrEmail: dbUser.email },
      });

      toast.success("Asset deleted successfully!");
      setAssets((prev) => prev.filter((a) => a._id !== asset._id));
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete asset";
      toast.error(message);

      // Optional: Show detailed message if active requests block deletion
      if (err.response?.status === 409) {
        MySwal.fire({
          title: "Cannot Delete",
          text: message,
          icon: "error",
        });
      }
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
        <h1 className="text-3xl font-bold">My Assets</h1>
        <p className="text-base-content/70 mt-2">
          Manage all assets added to your company
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by asset name..."
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Assets Table */}
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
                <tr key={asset._id} className="hover">
                  <td>
                    <div className="avatar">
                      <div className="w-16 rounded">
                        <img src={asset.productImage} alt={asset.productName} />
                      </div>
                    </div>
                  </td>
                  <td className="font-medium">{asset.productName}</td>
                  <td>
                    <span
                      className={`badge ${
                        asset.productType === "Returnable"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {asset.productType}
                    </span>
                  </td>
                  <td>{asset.productQuantity}</td>
                  <td>{new Date(asset.dateAdded).toLocaleDateString()}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="btn btn-sm btn-ghost text-info"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(asset)}
                        className="btn btn-sm btn-ghost text-error"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingAsset && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Asset</h3>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Asset Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Quantity</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="input input-bordered w-full"
                  value={formData.productQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, productQuantity: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium">Image URL</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={formData.productImage}
                  onChange={(e) =>
                    setFormData({ ...formData, productImage: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setEditingAsset(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AssetList;