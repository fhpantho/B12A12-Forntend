import React from "react";

const LoaderSpinner = ({ size = 16, colors = ["#4f46e5", "#06b6d4", "#facc15", "#ef4444"] }) => {
  /*
    size: size in Tailwind spacing units (e.g., 16 = w-16 h-16 = 4rem)
    colors: array of colors for the gradient spinner
  */

  const gradient = `conic-gradient(${colors.join(", ")})`;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
          borderRadius: "50%",
          background: gradient,
          animation: "spin 1.2s linear infinite",
        }}
        className="relative before:absolute before:inset-2 before:bg-base-100 before:rounded-full before:block"
      ></div>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoaderSpinner;
