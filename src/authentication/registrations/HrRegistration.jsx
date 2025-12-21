import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios";

const HrRegistration = () => {
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();
  const { registerUser, updateUserInfo, loading, setLoading, dbUser } = UseAuth();

  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (dbUser?.role === "HR") {
      navigate("/dashboard/hr", { replace: true });
    } else if (dbUser?.role === "EMPLOYEE") {
      navigate("/dashboard/employee", { replace: true });
    }
  }, [dbUser, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setUploading(true);

    try {
      // Validate email uniqueness
      await axiosSecure.post("/user/validate", { email: data.email });

      // Upload company logo
      const logoFile = data.companyLogo[0];
      if (!logoFile) throw new Error("Company logo is required");

      const formData = new FormData();
      formData.append("image", logoFile);
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagehostapikey}`,
        formData
      );

      if (!imgRes.data.success) throw new Error("Logo upload failed");
      const companyLogo = imgRes.data.data.url;

      // Firebase registration
      await registerUser(data.email, data.password);
      await updateUserInfo({
        displayName: data.name,
        photoURL: companyLogo,
      });

      // Save to MongoDB
      const userData = {
        name: data.name,
        email: data.email,
        role: "HR",
        companyName: data.companyName,
        companyLogo,
        dateOfBirth: data.dateOfBirth,
      };

      await axiosSecure.post("/user", userData);

      toast.success("HR registration successful! Welcome to AssetVerse");
      // No need to navigate — useEffect will catch dbUser change
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Google sign-in logic (you'll add later)
      toast.info("Google Sign-In coming soon!");
    } catch (err) {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg font-medium">Creating your HR account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body p-8 lg:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join as HR Manager
            </h1>
            <p className="text-base-content/70 mt-3 text-lg">
              Start managing your company's assets today
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="text-error text-sm mt-1">{errors.name.message}</span>}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Company Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Tech Corp Ltd"
                  className="input input-bordered w-full"
                  {...register("companyName", { required: "Company name is required" })}
                />
                {errors.companyName && <span className="text-error text-sm mt-1">{errors.companyName.message}</span>}
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Company Logo</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
                {...register("companyLogo", { required: "Logo is required" })}
              />
              {errors.companyLogo && <span className="text-error text-sm mt-1">{errors.companyLogo.message}</span>}
              {uploading && <span className="text-info text-sm mt-2 block">Uploading logo...</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="hr@company.com"
                  className="input input-bordered w-full"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Date of Birth</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("dateOfBirth", { required: "Date of birth is required" })}
              />
              {errors.dateOfBirth && <span className="text-error text-sm mt-1">{errors.dateOfBirth.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="btn btn-primary btn-lg w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white border-0"
            >
              {(loading || uploading) ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Register as HR Manager"
              )}
            </button>
          </form>

          <div className="divider my-8">OR</div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full hover:bg-base-200"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.87 0 7.33 1.41 10.05 4.15l7.5-7.5C37.69 2.79 31.29 0 24 0 14.67 0 6.75 5.58 2.66 13.72l8.66 6.73C13.99 13.36 18.58 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.08 24.69c0-1.62-.15-3.25-.45-4.84H24v9.17h12.42c-.54 2.88-2.17 5.32-4.61 6.95v5.93h7.46c4.37-4.03 6.89-9.96 6.89-17.21z"/>
              <path fill="#FBBC05" d="M11.32 20.45C10.84 18.86 10.56 17.19 10.56 15.5s.28-3.36.76-4.95L2.66 3.82C.95 7.73 0 12.05 0 16.5s.95 8.77 2.66 12.68l8.66-6.73z"/>
              <path fill="#4285F4" d="M24 48c6.48 0 11.91-2.14 15.88-5.79l-7.46-5.93c-2.15 1.44-4.9 2.29-8.42 2.29-5.42 0-10.01-3.86-11.68-9.05l-8.66 6.73C6.75 42.42 14.67 48 24 48z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default HrRegistration;