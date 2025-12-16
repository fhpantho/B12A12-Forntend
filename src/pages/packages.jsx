import React from "react";
import { motion } from "framer-motion";

const packages = [
  {
    name: "Basic",
    employeeLimit: 5,
    price: 5,
    features: ["Asset Tracking", "Employee Management", "Basic Support"],
  },
  {
    name: "Standard",
    employeeLimit: 10,
    price: 8,
    features: ["All Basic features", "Advanced Analytics", "Priority Support"],
  },
  {
    name: "Premium",
    employeeLimit: 20,
    price: 15,
    features: ["All Standard features", "Custom Branding", "24/7 Support"],
  },
];

const PackagesSection = () => {
  return (
    <section className="py-20 bg-white">
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
          className="text-gray-600 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Pick a subscription that fits your company's needs. Upgrade anytime.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-gray-500 mb-4">
                  Up to {pkg.employeeLimit} employees
                </p>
                <p className="text-3xl font-extrabold mb-6">${pkg.price}/mo</p>
                <ul className="text-gray-700 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="mb-2 before:content-['✔'] before:text-green-500 before:mr-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-auto btn btn-primary w-full">
                Select Package
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
