import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center">
          {/* Cancel Icon */}
          <div className="mx-auto mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-red-600">
            Payment Cancelled
          </h2>

          <p className="mt-2 text-gray-500">
            Your payment was not completed. No charges were made.
          </p>

          <div className="card-actions mt-6 flex justify-center gap-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard/hr/packages")}
            >
              Try Again
            </button>

            <button
              className="btn btn-outline"
              onClick={() => navigate("/dashboard/hr")}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
