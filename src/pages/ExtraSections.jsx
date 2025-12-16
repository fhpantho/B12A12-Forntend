import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const steps = [
  {
    id: 1,
    title: "Register Your Company",
    description: "HR managers can quickly register their company and start managing assets.",
    icon: "🏢"
  },
  {
    id: 2,
    title: "Manage Assets",
    description: "Add assets, assign them to employees, and keep track of returns effortlessly.",
    icon: "📦"
  },
  {
    id: 3,
    title: "Track & Report",
    description: "Monitor asset usage and generate reports to ensure accountability.",
    icon: "📊"
  }
];

const faqs = [
  {
    question: "Can employees belong to multiple companies?",
    answer: "Yes, employees can request assets from multiple companies and be affiliated accordingly."
  },
  {
    question: "Is there a limit on the number of assets per employee?",
    answer: "Asset limits are enforced based on the HR manager's subscription package."
  },
  {
    question: "How do I upgrade my package?",
    answer: "HR managers can upgrade packages directly from the dashboard using Stripe payments."
  }
];

const ExtraSections = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* How It Works */}
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * step.id }}
            >
              <div className="text-6xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="max-w-3xl mx-auto mb-16">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow mb-4 overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 text-left"
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDownIcon
                  className={`w-6 h-6 transition-transform duration-300 ${activeFAQ === idx ? "rotate-180" : ""}`}
                />
              </button>
              {activeFAQ === idx && (
                <motion.div
                  className="p-4 text-gray-600 border-t border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          className="bg-primary text-white rounded-xl p-10 shadow-lg flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-3xl font-bold">Ready to get started?</h3>
            <p className="text-lg">Sign up today and streamline your asset management process.</p>
          </div>
          <button className="btn btn-secondary px-6 py-3 font-semibold">Contact Us</button>
        </motion.div>

      </div>
    </section>
  );
};

export default ExtraSections;
