import React from "react";
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

  const onSubmit = (data) => {
    singInUser(data.email, data.password)
    .then(() => {
      toast.success("User log in Succesfully")
      navigate(from, { replace: true });
    })
    .catch(() => {
      toast.error("failed to login User");
      setLoading(false)
    });
  };

  const googlesingin = () => {
    googleSingIN().then(() => {
      toast.success("User log in Succesfully")
      navigate(from, { replace: true });
    })
    .catch(() => {
      toast.error("Failed to Login with google");
      setLoading(false)
    });
  };


  if(loading)
  {
    return(
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="https://i.gifer.com/XOsX.gif"
          alt="Loading..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600 font-medium">loading Information</p>
      </div>
    )
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
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Minimum 6 characters"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
                })}
              />
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
            onClick={googlesingin}
            className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-base-300 rounded-lg bg-white dark:bg-base-200 hover:bg-base-100 transition-all font-semibold shadow-sm"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            aria-label="Continue with Google"
          >
            <svg width="24" height="24" viewBox="0 0 48 48" className="mr-2" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C34.73 32.364 29.807 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.69 0 5.164.896 7.163 2.393l6.084-6.084C33.527 6.053 28.973 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 19.799-8.955 19.799-20 0-1.341-.138-2.651-.377-3.917z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 16.104 19.004 13 24 13c2.69 0 5.164.896 7.163 2.393l6.084-6.084C33.527 6.053 28.973 4 24 4c-7.732 0-14.41 4.41-17.694 10.691z"/><path fill="#FBBC05" d="M24 44c5.736 0 10.548-1.89 14.198-5.13l-6.537-5.357C29.807 36 24 36 24 36c-5.807 0-10.73-3.636-11.303-8.083l-6.571 4.819C9.59 39.59 16.268 44 24 44z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303C34.73 32.364 29.807 36 24 36c-5.807 0-10.73-3.636-11.303-8.083l-6.571 4.819C9.59 39.59 16.268 44 24 44c5.736 0 10.548-1.89 14.198-5.13l-6.537-5.357C29.807 36 24 36 24 36c-5.807 0-10.73-3.636-11.303-8.083l-6.571 4.819C9.59 39.59 16.268 44 24 44c11.045 0 19.799-8.955 19.799-20 0-1.341-.138-2.651-.377-3.917z"/></g></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
