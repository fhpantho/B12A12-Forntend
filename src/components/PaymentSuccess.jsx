import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import UseAxiosSecure from "../hooks/UseAxiosSecure";
import UseAuth from "../hooks/UseAuth";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionID = searchParams.get("session_id");
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();
  const { refreshDbUser } = UseAuth();

  useEffect(() => {
    if (sessionID) {
      axiosSecure
        .patch(`/payment-success?session_id=${sessionID}`)
        .then(() => {
          refreshDbUser(); // 
        })
        .then(() => {
            setTimeout(navigate("/dashboard/hr"), 5000)
        })
        .catch((err) => {
          console.error("Payment confirmation failed", err);
        });
    }
  }, [sessionID, axiosSecure, refreshDbUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-4xl font-bold text-green-600">
        Payment Successful 🎉
      </h2>
    </div>
  );
};

export default PaymentSuccess;
