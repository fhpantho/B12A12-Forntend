import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UseAxiosSecure from "../hooks/UseAxiosSecure";
import UseAuth from "../hooks/UseAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PackagesSection = () => {
  const axiosSecure = UseAxiosSecure();
  const { user, dbUser } = UseAuth();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPackage();
    }
  }, [user]);

  const fetchPackage = async () => {
    try {
      const token = await user.getIdToken(true);
      const res = await axiosSecure.get("/packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPackages(res.data || []);
    } catch (err) {
      toast.error("Failed to load package collection");
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20">Loading packages...</p>;
  }

  // 🔑 Find current plan price
  const currentPackage = packages.find(
    (pkg) => pkg.name === dbUser?.subscription
  );
  const currentPrice = currentPackage?.price ?? 0;

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Package
        </motion.h2>

        <motion.p
          className="mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Pick a subscription that fits your company's needs. Upgrade anytime.
        </motion.p>

        <motion.p
          className="mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your Current Plan is : {dbUser?.subscription}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const isCurrentPlan = dbUser?.subscription === pkg.name;
            const isLowerPlan = pkg.price < currentPrice;
            const isUpgrade = pkg.price > currentPrice;

            let buttonText = "Select Package";
            let disabled = false;
            let buttonClass = "btn-primary";

            if (isCurrentPlan) {
              buttonText = "Current Plan";
              disabled = true;
              buttonClass = "btn-disabled";
            } else if (isLowerPlan) {
              buttonText = "Downgrade Not Allowed";
              disabled = true;
              buttonClass = "btn-disabled";
            } else if (isUpgrade) {
              buttonText = "Upgrade";
            }

            return (
              <motion.div
                key={pkg._id}
                className={`p-8 rounded-xl shadow-lg flex flex-col ${
                  isCurrentPlan ? "border-2 border-primary" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
              >
                <div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="mb-4">
                    Up to {pkg.employeeLimit} employees
                  </p>
                  <p className="text-3xl font-extrabold mb-6">
                    ${pkg.price}/mo
                  </p>

                  <ul className="mb-6 text-left">
                    {pkg.features?.map((feature, i) => (
                      <li
                        key={i}
                        className="mb-2 before:content-['✔'] before:text-green-500 before:mr-2"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      navigate(`/dashboard/hr/payment/${pkg._id}`);
                    }
                  }}
                  className={`btn w-full ${buttonClass}`}
                >
                  {buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
