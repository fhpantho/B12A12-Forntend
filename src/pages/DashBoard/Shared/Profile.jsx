import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../hooks/UseAxiosSecure";
import UseAuth from "../../../hooks/UseAuth";
import { toast } from "react-toastify";

const Profile = () => {
  const axiosSecure = UseAxiosSecure();
  const { dbUser, setDbUser, user, updateUserInfo } = UseAuth(); 

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name || "");
      setDateOfBirth(
        dbUser.dateOfBirth
          ? new Date(dbUser.dateOfBirth).toISOString().split("T")[0]
          : ""
      );
      const currentImage = dbUser.photo || dbUser.companyLogo || "";
      setProfileImage(currentImage);
      setPreviewImage(currentImage);

      if (dbUser.role === "EMPLOYEE") {
        fetchAffiliations();
      }
      setLoading(false);
    }
  }, [dbUser]);

  const fetchAffiliations = async () => {
    try {
      const res = await axiosSecure.get(
        `/employee-affiliations?employeeEmail=${dbUser.email}`
      );
      setAffiliations(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load affiliations");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    // Upload to the Hoster
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagehostapikey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        setProfileImage(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    }
  };

const handleUpdate = async () => {
  if (!name.trim()) {
    toast.error("Name is required");
    return;
  }

  try {
    const updatedData = {
      name: name.trim(),
      dateOfBirth: dateOfBirth || null,
    };

    let newPhotoURL = null;
    if (profileImage !== (dbUser.photo || dbUser.companyLogo || user?.photoURL || "")) {
      updatedData.photo = profileImage;
      newPhotoURL = profileImage;
    }

    // 1. Update MongoDB
    const response = await axiosSecure.patch(`/user/${dbUser.email}`, updatedData);
    if (!response.data.success) throw new Error(response.data.message);

    // 2. Update Firebase Auth (only name and photoURL)
    if (user) {
      await updateUserInfo({
        displayName: name.trim(),
        photoURL: newPhotoURL  
      });
    }

    // 3. Update local dbUser state
    setDbUser({
      ...dbUser,
      name: updatedData.name,
      dateOfBirth: updatedData.dateOfBirth ? new Date(updatedData.dateOfBirth) : null,
      photo: dbUser.role === "EMPLOYEE" ? (newPhotoURL || dbUser.photo) : dbUser.photo,
      companyLogo: dbUser.role === "HR" ? (newPhotoURL || dbUser.companyLogo) : dbUser.companyLogo,
    });

    toast.success("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed to update profile");
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
    <div className="min-h-screen p-6" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="card shadow-xl p-8 text-center" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <div className="avatar mb-6">
              <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                <img
                  src={previewImage || "https://via.placeholder.com/200"}
                  alt="Profile"
                />
              </div>
            </div>

            <label className="btn btn-primary btn-block cursor-pointer">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <div className="mt-6">
              <p className="text-2xl font-bold">{dbUser.name}</p>
              <p className="text-lg text-base-content/60">
                {dbUser.role === "HR" ? "HR Manager" : "Employee"}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 card shadow-xl p-8" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

            <div className="space-y-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  value={dbUser.email}
                  className="input input-bordered w-full bg-base-200"
                  readOnly
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Date of Birth</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* HR Company Info */}
              {dbUser.role === "HR" && (
                <div className="p-6 rounded-lg" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                  <h3 className="font-bold text-xl mb-4">Company Details</h3>
                  <p className="text-lg">
                    <strong>{dbUser.companyName}</strong>
                  </p>
                  <div className="avatar mt-4">
                    <div className="w-24 rounded">
                      <img src={dbUser.companyLogo} alt="Company" />
                    </div>
                  </div>
                </div>
              )}

              {/* Employee Affiliations */}
              {dbUser.role === "EMPLOYEE" && affiliations.length > 0 && (
                <div className="p-6 rounded-lg" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                  <h3 className="font-bold text-xl mb-4">My Companies</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {affiliations.map((aff) => (
                      <div
                        key={aff._id}
                        className="flex items-center gap-4 p-4 rounded-lg"
                        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
                      >
                        <div className="avatar">
                          <div className="w-16 rounded">
                            <img
                              src={aff.companyLogo || "https://via.placeholder.com/64"}
                              alt={aff.companyName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{aff.companyName}</p>
                          <p className="text-sm text-base-content/60">
                            Since {new Date(aff.affiliationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button onClick={handleUpdate} className="btn btn-primary btn-lg w-full">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;