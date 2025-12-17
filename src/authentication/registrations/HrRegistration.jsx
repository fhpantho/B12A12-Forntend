import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import UseAuth from "../../hooks/UseAuth";
import GoogleButton from "react-google-button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import UseAxiosSecure from "../../hooks/UseAxiosSecure";

const HrRegistration = () => {
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();
  const { registerUser, googleSingIN, updateUserInfo, loading, setLoading, dbUser } = UseAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosSecure.post("/user/validate", { email: data.email });

      const logoFile = data.companyLogo?.[0];
      if (!logoFile) throw new Error("Company logo is required");

      const formData = new FormData();
      formData.append("image", logoFile);
      const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagehostapikey}`;
      const imgRes = await axios.post(imageAPIURL, formData);
      const imageURL = imgRes?.data?.data?.url;
      if (!imageURL) throw new Error("Image upload failed");

      await registerUser(data.email, data.password);
      await updateUserInfo({ displayName: data.name, photoURL: imageURL });

      const userData = {
        name: data.name,
        companyName: data.companyName,
        companyLogo: imageURL,
        role: "HR",
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        createdAt: new Date().toISOString(),
      };
      await axiosSecure.post("/user", userData);

      toast.success("Registered successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const googleSignInHandler = async () => {
    setLoading(true);
    try {
      const result = await googleSingIN();
      const user = result.user;
      const userData = {
        name: user.displayName,
        companyLogo: user.photoURL,
        role: "HR",
        email: user.email,
        createdAt: new Date().toISOString(),
      };
      await axiosSecure.post("/user", userData);
      toast.success("Google Sign-in successful");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dbUser?.role === "HR") navigate("/dashboard/hr");
    if (dbUser?.role === "EMPLOYEE") navigate("/dashboard/employee");
  }, [dbUser, navigate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src="https://i.gifer.com/XOsX.gif" alt="Loading..." className="w-16 h-16 mb-4" />
      <p className="text-gray-600 font-medium">Loading information...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 mt-5">
      <div className="card w-full max-w-lg shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">HR Registration</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input type="text" placeholder="Full Name" className="input input-bordered w-full" {...register("name", { required: true })} />
            <input type="text" placeholder="Company Name" className="input input-bordered w-full" {...register("companyName", { required: true })} />
            <input type="file" className="file-input file-input-bordered w-full" {...register("companyLogo", { required: true })} />
            <input type="email" placeholder="Email" className="input input-bordered w-full" {...register("email", { required: true })} />
            <input type="password" placeholder="Password" className="input input-bordered w-full" {...register("password", { required: true, minLength: 6 })} />
            <input type="date" className="input input-bordered w-full" {...register("dateOfBirth", { required: true })} />
            <button className="btn btn-primary w-full mt-3">Register as HR</button>
          </form>
          <div className="divider">OR</div>
          <GoogleButton onClick={googleSignInHandler} />
        </div>
      </div>
    </div>
  );
};

export default HrRegistration;
