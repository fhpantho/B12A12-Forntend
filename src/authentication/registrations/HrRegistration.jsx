import React from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import GoogleButton from "react-google-button";

const HrRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerUser, googleSingIN } = UseAuth();

  const onSubmit = (data) => {
    registerUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .cacth((err) => {
        console.log(err.massage);
      });
  };
  const googlesingin = () => {
    googleSingIN().then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            HR Registration
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Your full name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  Full name is required
                </span>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Company name"
                {...register("companyName", { required: true })}
              />
              {errors.companyName && (
                <span className="text-red-500 text-sm">
                  Company name is required
                </span>
              )}
            </div>

            {/* Company Logo */}
            <div>
              <label className="label">Company Logo</label>
              <input
                type="file"
                className="input file-input input-bordered w-full "
                placeholder="ImgBB / Cloudinary URL"
                {...register("companyLogo", { required: true })}
              />
              {errors.companyLogo && (
                <span className="text-red-500 text-sm">
                  Company logo URL is required
                </span>
              )}
            </div>

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

            {/* Date of Birth */}
            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("dateOfBirth", { required: true })}
              />
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">
                  Date of birth is required
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button className="btn btn-primary w-full">Register as HR</button>
            </div>
          </form>
          <span className="text-center">or</span>
          <div className="w-full flex justify-center">
            <GoogleButton onClick={googlesingin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrRegistration;
