import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios";

const EmRegistration = () => {
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();
  const { registerUser, updateUserInfo, loading, setLoading, dbUser } = UseAuth();

  const [uploading, setUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password toggle state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (dbUser?.role === "EMPLOYEE") {
      navigate("/dashboard/employee", { replace: true });
    } else if (dbUser?.role === "HR") {
      navigate("/dashboard/hr", { replace: true });
    }
  }, [dbUser, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setUploading(true);

    try {
      await axiosSecure.post("/user/validate", { email: data.email });

      const imageFile = data.image[0];
      if (!imageFile) throw new Error("Profile photo is required");

      const formData = new FormData();
      formData.append("image", imageFile);
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagehostapikey}`,
        formData
      );

      if (!imgRes.data.success) throw new Error("Photo upload failed");
      const photoURL = imgRes.data.data.url;

      await registerUser(data.email, data.password);
      await updateUserInfo({
        displayName: data.name,
        photoURL,
      });

      const userData = {
        name: data.name,
        email: data.email,
        role: "EMPLOYEE",
        photo: photoURL,
        dateOfBirth: data.dateOfBirth,
      };

      await axiosSecure.post("/user", userData);

      toast.success("Employee registration successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-lg font-medium">Creating your account...</p>
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
              Join as Employee
            </h1>
            <p className="text-base-content/70 mt-3 text-lg">
              Start your journey with AssetVerse
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
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

            {/* Profile Photo */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Profile Photo</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
                {...register("image", { required: "Photo is required" })}
              />
              {errors.image && <span className="text-error text-sm mt-1">{errors.image.message}</span>}
              {uploading && <span className="text-info text-sm mt-2 block">Uploading photo...</span>}
            </div>

            {/* Email and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="input input-bordered w-full"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
              </div>

              {/* Password with toggle */}
              <div className="relative">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pr-12"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-8 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <span className="text-error text-sm mt-1">{errors.password.message}</span>
                )}
              </div>
            </div>

            {/* Date of Birth */}
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

            {/* Submit */}
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
                "Register as Employee"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-8">OR</div>

          {/* Google Sign-In */}
          <button
            onClick={() => toast.info("Google Sign-In coming soon!")}
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

export default EmRegistration;
