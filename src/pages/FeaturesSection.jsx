import React from "react";
import { BoltIcon, DeviceTabletIcon, ShieldCheckIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    icon: <BoltIcon className="w-12 h-12 text-primary mb-4" />,
    title: "Fast & Efficient",
    description: "Manage assets and employee requests with speed and accuracy."
  },
  {
    icon: <DeviceTabletIcon className="w-12 h-12 text-primary mb-4" />,
    title: "Responsive Design",
    description: "Works seamlessly on mobile, tablet, and desktop devices."
  },
  {
    icon: <ShieldCheckIcon className="w-12 h-12 text-primary mb-4" />,
    title: "Secure & Reliable",
    description: "Keep your company data safe with enterprise-grade security."
  },
  {
    icon: <ChartBarIcon className="w-12 h-12 text-primary mb-4" />,
    title: "Analytics & Reports",
    description: "Track assets and employee performance with detailed reports."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Key Features
        </motion.h2>
        <motion.p
          className="mb-12 max-w-3xl mx-auto"
          style={{ color: 'var(--foreground)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AssetVerse is built to simplify asset management for your company.
        </motion.p>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col items-center text-center"
              style={{ background: 'var(--background)', color: 'var(--foreground)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
