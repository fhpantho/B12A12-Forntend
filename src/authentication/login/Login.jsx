import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const axiosSecure = UseAxiosSecure();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { singInUser, googleSignIn, refreshDbUser, loading, setLoading } = UseAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  // ===============================
  // Email/Password Login
  // ===============================
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await singInUser(data.email, data.password);
      toast.success("User logged in successfully!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Failed to login user");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Google Login
  // ===============================
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const firebaseUser = await googleSignIn(); // must return Firebase user
      const email = firebaseUser.email;

      // 1️⃣ Check if user exists in DB
      const res = await axiosSecure.get(`/user?email=${email}`);
      const dbUser = res.data?.[0];

      if (dbUser) {
        // ✅ User exists → refresh context and navigate
        await refreshDbUser();
        toast.success("Logged in successfully!");
        if (dbUser.role === "HR") navigate("/dashboard/hr", { replace: true });
        else if (dbUser.role === "EMPLOYEE") navigate("/dashboard/employee", { replace: true });
        else navigate("/", { replace: true });
      } else {
        // ❌ User not in DB → rollback Firebase account
        if (firebaseUser) {
          try {
            await firebaseUser.delete();
          } catch (err) {
            console.error("Failed to rollback Firebase user:", err);
          }
        }

        setPendingEmail(email);
        setShowRegisterModal(true);
      }
    } catch (error) {
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Fill form with demo credentials
  // ===============================
  const fillDemoCredentials = (type) => {
    if (type === "HR") {
      setValue("email", "hr@ph.com");
      setValue("password", "#Hr#fahim13");
    } else if (type === "EMPLOYEE") {
      setValue("email", "em@ph.com");
      setValue("password", "#Em#fahim13");
    }
  };

  // ===============================
  // Loading Spinner
  // ===============================
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

          {/* Demo Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => fillDemoCredentials("HR")}
              className="btn btn-sm btn-outline btn-primary flex-1"
            >
              Demo HR
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("EMPLOYEE")}
              className="btn btn-sm btn-outline btn-secondary flex-1"
            >
              Demo Employee
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="email@company.com"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
            </div>

            <div className="relative">
              <label className="label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-12"
                placeholder="Minimum 6 characters"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
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
                <span className="text-red-500 text-sm">Password is required</span>
              )}
              {errors.password?.type === "minLength" && (
                <span className="text-red-500 text-sm">Minimum 6 characters required</span>
              )}
              {errors.password?.type === "pattern" && (
                <span className="text-red-500 text-sm">
                  Must include uppercase, lowercase, number & special character
                </span>
              )}
            </div>

            <div className="pt-4">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-base-300"></div>
            <span className="mx-3 text-base-content/70">or</span>
            <div className="flex-grow h-px bg-base-300"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full hover:bg-base-200"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.87 0 7.33 1.41 10.05 4.15l7.5-7.5C37.69 2.79 31.29 0 24 0 14.67 0 6.75 5.58 2.66 13.72l8.66 6.73C13.99 13.36 18.58 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.08 24.69c0-1.62-.15-3.25-.45-4.84H24v9.17h12.42c-.54 2.88-2.17 5.32-4.61 6.95v5.93h7.46c4.37-4.03 6.89-9.96 6.89-17.21z" />
              <path fill="#FBBC05" d="M11.32 20.45C10.84 18.86 10.56 17.19 10.56 15.5s.28-3.36.76-4.95L2.66 3.82C.95 7.73 0 12.05 0 16.5s.95 8.77 2.66 12.68l8.66-6.73z" />
              <path fill="#4285F4" d="M24 48c6.48 0 11.91-2.14 15.88-5.79l-7.46-5.93c-2.15 1.44-4.9 2.29-8.42 2.29-5.42 0-10.01-3.86-11.68-9.05l-8.66 6.73C6.75 42.42 14.67 48 24 48z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      {/* Modal for registration */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">No account found</h2>
            <p className="mb-6">Please choose how you want to register:</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/register/hr?email=${pendingEmail}`)}
                className="btn btn-primary flex-1"
              >
                Register as HR
              </button>
              <button
                onClick={() => navigate(`/register/employee?email=${pendingEmail}`)}
                className="btn btn-secondary flex-1"
              >
                Register as Employee
              </button>
            </div>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="mt-4 btn btn-ghost w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
