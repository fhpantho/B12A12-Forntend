import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";

const MyTeam = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser } = UseAuth();

  const [affiliations, setAffiliations] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [colleagues, setColleagues] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee's affiliations
  useEffect(() => {
    const fetchAffiliations = async () => {
      if (!dbUser?.email) return;
      try {
        const res = await axiosSecure.get(`/employee-affiliations?employeeEmail=${dbUser.email}`);
        const data = res.data.data || [];
        setAffiliations(data);
        if (data.length > 0) {
          setSelectedCompany(data[0].companyName);
        }
      } catch (err) {
        toast.error("Failed to load companies");
      }
    };
    fetchAffiliations();
  }, [axiosSecure, dbUser]);

  // Fetch team when company changes
  useEffect(() => {
    const fetchTeam = async () => {
      if (!selectedCompany || !dbUser?.email) {
        setColleagues([]);
        setUpcomingBirthdays([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axiosSecure.get(
          `/my-team?companyName=${encodeURIComponent(selectedCompany)}&employeeEmail=${dbUser.email}`
        );

        if (res.data.success) {
          setColleagues(res.data.colleagues || []);
          setUpcomingBirthdays(res.data.upcomingBirthdays || []);
        }
      } catch (err) {
        toast.error("Failed to load team members");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [selectedCompany, axiosSecure, dbUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (affiliations.length === 0) {
    return (
      <div className="p-10 text-center">
        <p className="text-2xl text-base-content/60">No company affiliation yet</p>
        <p className="mt-4 text-base-content/50">
          Request an asset from HR to get affiliated with a company.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">My Team</h1>
        <p className="text-xl text-base-content/70 mt-3">
          Meet your colleagues
        </p>
      </div>

      {/* Company Selector */}
      <div className="mb-8 max-w-md">
        <label className="label">
          <span className="label-text font-semibold text-lg">Select Company</span>
        </label>
        <select
          className="select select-bordered select-lg w-full"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {affiliations.map((aff) => (
            <option key={aff._id} value={aff.companyName}>
              {aff.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span>🎉</span> Upcoming Birthdays This Month
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBirthdays.map((emp) => (
              <div
                key={emp.email}
                className="card bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 shadow-lg p-6 text-center"
              >
                <div className="avatar mb-4">
                  <div className="w-20 rounded-full ring ring-pink-400 ring-offset-2 mx-auto">
                    <img src={emp.photo || "https://i.ibb.co.com/4pDndTF/avatar.png"} alt={emp.name} />
                  </div>
                </div>
                <h3 className="font-bold text-lg">{emp.name}</h3>
                <p className="text-sm text-base-content/70">{emp.email}</p>
                <p className="mt-3 text-pink-600 font-semibold">
                  {new Date(emp.dateOfBirth).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Colleagues Grid */}
      <h2 className="text-2xl font-bold mb-6">Team Members ({colleagues.length})</h2>

      {colleagues.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-2xl">
          <p className="text-xl text-base-content/60">No colleagues in this company yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {colleagues.map((emp) => (
            <div
              key={emp.email}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300"
            >
              <div className="card-body items-center text-center p-8">
                <div className="avatar mb-4">
                  <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                    <img
                      src={emp.photo || "https://i.ibb.co.com/4pDndTF/avatar.png"}
                      alt={emp.name}
                      className="object-cover"
                    />
                  </div>
                </div>

                <h3 className="card-title text-lg">{emp.name}</h3>
                <p className="text-sm text-base-content/70 break-all">{emp.email}</p>

                <div className="mt-4">
                  <p className="text-xs text-base-content/50">
                    Joined {new Date(emp.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeam;