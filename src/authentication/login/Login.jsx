import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { singInUser, googleSingIN, loading, setLoading } = UseAuth();

  const [showPassword, setShowPassword] = useState(false); // <-- added state

  const onSubmit = (data) => {
    singInUser(data.email, data.password)
      .then(() => {
        toast.success("User log in Successfully");
        navigate(from, { replace: true });
      })
      .catch(() => {
        toast.error("Failed to login User");
        setLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    toast.info("Coming soon");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="https://i.gifer.com/XOsX.gif"
          alt="Loading..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600 font-medium">Loading Information</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Login User</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="email@company.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email is required</span>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="label">Password</label>
              <input
                type={showPassword ? "text" : "password"} // <-- toggle
                className="input input-bordered w-full pr-12"
                placeholder="Minimum 6 characters"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
                })}
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password?.type === "required" && (
                <span className="text-red-500 text-sm">
                  Password is required
                </span>
              )}
              {errors.password?.type === "minLength" && (
                <span className="text-red-500 text-sm">
                  Minimum 6 characters required
                </span>
              )}
              {errors.password?.type === "pattern" && (
                <span className="text-red-500 text-sm">
                  Must include uppercase, lowercase, number & special character
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-base-300"></div>
            <span className="mx-3 text-base-content/70">or</span>
            <div className="flex-grow h-px bg-base-300"></div>
          </div>

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

export default Login;
