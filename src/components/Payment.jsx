import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import UseAuth from "../hooks/UseAuth";
import UseAxiosSecure from "../hooks/UseAxiosSecure";

const Payment = () => {
  const { id } = useParams();
  const { user, dbUser } = UseAuth();
  const axiosSecure = UseAxiosSecure();

  const [singlePackage, setSinglePackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetchPackage = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken(true);

        const res = await axiosSecure.get(`/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSinglePackage(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load package data");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [user, id, axiosSecure]);
  const handlePayment = async () => {

    const paymentInfo = {

      hrEmail : dbUser.email,
      id : id

    }
    const res = await axiosSecure.post('/payment-checkout-session', paymentInfo)
    console.log(res.data)
    window.location.href = res.data.url;

  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
          <h2 className="card-title text-3xl justify-center">
            {singlePackage?.name}
          </h2>

          <p className="text-sm opacity-70">
            Employee Limit: {singlePackage?.employeeLimit}
          </p>

          <div className="my-4">
            <span className="text-4xl font-extrabold text-primary">
              ${singlePackage?.price}
            </span>
            <span className="opacity-60"> / month</span>
          </div>

          <div className="text-left">
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1">
              {singlePackage?.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="card-actions mt-6">
            <button onClick={handlePayment} className="btn btn-primary w-full">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
