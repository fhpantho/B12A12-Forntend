import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import GoogleButton from "react-google-button";

import UseAuth from "../../hooks/UseAuth";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";

const EmployeeRegistration = () => {
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    registerUser,
    googleSingIN,
    updateUserInfo,
    loading,
    setLoading,
  } = UseAuth();

  //  FORM SUBMIT 
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      //  BACKEND FIRST VALIDATION (MOST IMPORTANT)
      await axiosSecure.post("/user/validate", {
        email: data.email,
      });

      //  IMAGE VALIDATION
      const image = data.image?.[0];
      if (!image) {
        toast.error("Image is required");
        setLoading(false);
        return;
      }

      //  UPLOAD IMAGE
      const formData = new FormData();
      formData.append("image", image);

      const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagehostapikey}`;
      const imgRes = await axios.post(imageAPIURL, formData);

      const imageURL = imgRes?.data?.data?.url;
      if (!imageURL) throw new Error("Image upload failed");

      // CREATE FIREBASE USER (SAFE NOW)
      await registerUser(data.email, data.password);

      // UPDATE FIREBASE PROFILE
      await updateUserInfo({
        displayName: data.name,
        photoURL: imageURL,
      });

      //  SAVE USER TO BACKEND
      const userData = {
        name: data.name,
        photo: imageURL,
        role: "employee",
        email: data.email,
        dob: data.dateOfBirth,
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post("/user", userData);

      toast.success("Employee registered successfully");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Registration failed");
      }
      navigate("/emregistration");
    } finally {
      setLoading(false);
    }
  };

  //  GOOGLE SIGN IN 
  const googleSignInHandler = async () => {
    setLoading(true);

    try {
      const result = await googleSingIN();
      const user = result.user;

      const userData = {
        name: user.displayName,
        photo: user.photoURL,
        role: "employee",
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post("/user", userData);

      toast.success("Employee registered successfully");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  //  LOADING UI 
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="https://i.gifer.com/XOsX.gif"
          alt="Loading"
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  //  UI 
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Employee Registration
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                {...register("name", { required: true })}
              />
              {errors.name && <span className="text-red-500">Name is required</span>}
            </div>

            <div>
              <label className="label">Image</label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                {...register("image", { required: true })}
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered w-full"
                {...register("email", { required: true })}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input input-bordered w-full"
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
              />
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("dateOfBirth", { required: true })}
              />
            </div>

            <button className="btn btn-primary w-full">Register</button>
          </form>

          <div className="divider">OR</div>

          <div className="flex justify-center">
            <GoogleButton onClick={googleSignInHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
