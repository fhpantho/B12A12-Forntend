import React from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import GoogleButton from "react-google-button";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate } from "react-router";

const HrRegistration = () => {
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { registerUser, googleSingIN, updateUserInfo, loading, setLoading } = UseAuth();

  const onSubmit = async (data) => {
    try {
      //  get company logo
      const logoFile = data.companyLogo?.[0];
      if (!logoFile) {
        toast.error("Company logo is required");
        return;
      }

       //  create user
      await registerUser(data.email, data.password);

      // upload image
      const formData = new FormData();
      formData.append("image", logoFile);

      const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagehostapikey}`;

      const imgRes = await axios.post(imageAPIURL, formData);
      const imageURL = imgRes.data.data.url;

     

      // update profile
      await updateUserInfo({
        displayName: data.name,
        photoURL: imageURL,
      });

      //  success
      toast.success("Register User Successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed");
      setLoading(false)
      navigate("/hrregistration")
    }
  };

  const googlesingin = async () => {
    try {
      await googleSingIN();
      toast.success("Google Sign-in successful");
      navigate("/")
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="https://i.gifer.com/XOsX.gif"
          alt="Loading..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600 font-medium">loading Information</p>
      </div>
    );
  }

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
                className="file-input file-input-bordered w-full"
                {...register("companyLogo", { required: true })}
              />
              {errors.companyLogo && (
                <span className="text-red-500 text-sm">
                  Company logo is required
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
                <span className="text-red-500 text-sm">
                  Email is required
                </span>
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

            <button className="btn btn-primary w-full mt-3">
              Register as HR
            </button>
          </form>

          <div className="divider">OR</div>

          <div className="flex justify-center">
            <GoogleButton onClick={googlesingin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrRegistration;
