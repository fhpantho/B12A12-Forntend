import React, { useEffect, useState, useCallback } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const MyEmployeeList = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, user } = UseAuth(); // ✅ include user to get Firebase token

  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ current: 0, limit: 5 });
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    if (!dbUser?.email || !user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken(true); // ✅ get Firebase token

      const res = await axiosSecure.get(`/my-employees?hrEmail=${dbUser.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setEmployees(res.data.employees || []);
        setStats({
          current: res.data.currentEmployees || 0,
          limit: res.data.packageLimit || 5,
        });
      }
    } catch (err) {
      setEmployees([]);
      toast.error("Failed to load employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, dbUser?.email, user]);

  useEffect(() => {
    if (dbUser?.email && user) {
      fetchEmployees();
    }
  }, [fetchEmployees, dbUser?.email, user]);

  const fetchAvailableAssets = async () => {
    if (!dbUser?.email || !user) return;

    try {
      const token = await user.getIdToken(true);

      const res = await axiosSecure.get(`/assetcollection?email=${dbUser.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assets = res.data.data || [];
      setAvailableAssets(assets.filter((a) => a.productQuantity > 0));
    } catch (err) {
      toast.error("Failed to load assets");
      console.error(err);
    }
  };

  const handleDirectAssign = async () => {
    if (!selectedAssetId || !selectedEmployee || !user) {
      toast.error("Please select an asset and employee");
      return;
    }

    try {
      const token = await user.getIdToken(true);

      await axiosSecure.patch(
        "/direct-assign",
        {
          hrEmail: dbUser.email,
          employeeEmail: selectedEmployee.email,
          assetId: selectedAssetId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Asset assigned to ${selectedEmployee.name}`);
      setSelectedEmployee(null);
      setSelectedAssetId("");
      fetchEmployees(); // Refresh stats
    } catch (err) {
      toast.error(err.response?.data?.message || "Assignment failed");
      console.error(err);
    }
  };

  const handleRemoveEmployee = async (employeeEmail, employeeName) => {
    const result = await MySwal.fire({
      title: "Remove from Team?",
      text: `Remove ${employeeName} from your company? This will return all their assigned assets.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed || !user) return;

    try {
      const token = await user.getIdToken(true);

      await axiosSecure.patch(
        "/remove-employee",
        { hrEmail: dbUser.email, employeeEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${employeeName} removed from team`);
      setEmployees((prev) => prev.filter((emp) => emp.email !== employeeEmail));
      setStats((prev) => ({ ...prev, current: prev.current - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove employee");
      console.error(err);
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">My Employee List</h1>
        <p className="text-xl text-base-content/70 mb-6">
          Manage your affiliated employees
        </p>

        <div className="inline-block">
          <div
            className={`badge badge-lg px-8 py-5 text-2xl font-bold rounded-full shadow-lg ${
              stats.current >= stats.limit ? "badge-error" : "badge-primary"
            }`}
          >
            {stats.current} / {stats.limit}
          </div>
          {stats.current >= stats.limit && (
            <p className="text-warning mt-4 text-lg">
              Limit reached — upgrade package to add more
            </p>
          )}
        </div>
      </div>

      {/* Employees Grid - Max 3 per row */}
      {employees.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl shadow-inner">
          <p className="text-3xl font-semibold text-base-content/60 mb-4">
            No employees yet
          </p>
          <p className="text-lg text-base-content/50 max-w-md mx-auto">
            Employees will appear here after you approve their first asset request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((emp) => (
            <div
              key={emp.email}
              className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300"
            >
              {/* Avatar - Top Center */}
              <figure className="pt-8 px-8">
                <div className="avatar">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                    <img
                      src={emp.photo || "https://i.ibb.co.com/4pDndTF/avatar.png"}
                      alt={emp.name}
                      className="object-cover"
                    />
                  </div>
                </div>
              </figure>

              <div className="card-body items-center text-center pt-4 pb-8">
                <h3 className="card-title text-xl">{emp.name}</h3>
                <p className="text-sm text-base-content/70 break-all mt-1">
                  {emp.email}
                </p>

                <div className="divider my-6"></div>

                <div className="space-y-3 w-full text-sm">
                  <p>
                    <strong>Joined:</strong> {new Date(emp.joinDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Assets:</strong>{" "}
                    <span className="badge badge-primary ml-2">{emp.assetsCount}</span>
                  </p>
                </div>

                <div className="card-actions mt-6 flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      fetchAvailableAssets();
                    }}
                    className="btn btn-primary btn-outline w-full"
                  >
                    Assign Asset
                  </button>

                  <button
                    onClick={() => handleRemoveEmployee(emp.email, emp.name)}
                    className="btn btn-error btn-outline w-full"
                  >
                    Remove from Team
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Asset Modal */}
      {selectedEmployee && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4">
              Assign Asset to {selectedEmployee.name}
            </h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Select Asset</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
              >
                <option value="">Choose an available asset</option>
                {availableAssets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.productName} ({asset.productQuantity} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setSelectedEmployee(null);
                  setSelectedAssetId("");
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDirectAssign}
                disabled={!selectedAssetId}
                className="btn btn-primary"
              >
                Assign Asset
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default MyEmployeeList;
