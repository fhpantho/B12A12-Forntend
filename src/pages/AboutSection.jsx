import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "💼",
    title: "Efficient Asset Management",
    description:
      "Track, assign, and return assets easily across your organization.",
  },
  {
    icon: "📊",
    title: "Improved Productivity",
    description:
      "Ensure employees have the right tools, enhancing performance.",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description:
      "All data is securely stored with role-based access for employees and HR.",
  },
  {
    icon: "⚡",
    title: "Quick Setup",
    description:
      "Get started in minutes with minimal configuration and intuitive design.",
  },
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose AssetVerse?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AssetVerse is designed to simplify your HR and asset management processes, making tracking, allocation, and accountability seamless.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
