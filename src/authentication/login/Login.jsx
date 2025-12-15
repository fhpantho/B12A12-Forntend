import React from 'react';
import { useForm } from 'react-hook-form';
import UseAuth from '../../hooks/UseAuth';
import GoogleButton from 'react-google-button';

const Login = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

      const {singInUser, googleSingIN} = UseAuth()

      const onSubmit = (data) => {

        singInUser(data.email, data.password)


        
      }

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
            Login User
          </h2>

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


            {/* Submit Button */}
            <div className="pt-4">
              <button className="btn btn-primary w-full">
                Login
              </button>
            </div>

          </form>
          <span className="text-center">or</span>
          <div className="w-full flex justify-center">
            <GoogleButton
              onClick={googlesingin}
            />
          </div>
        </div>
      </div>
    </div>
    );
};

export default Login;