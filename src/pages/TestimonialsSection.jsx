import React from "react";
import { motion } from "framer-motion";
import { StarIcon, UsersIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";

const testimonials = [
  {
    name: "John Doe",
    company: "Acme Corp",
    feedback: "AssetVerse has completely transformed how we track company assets. Highly recommended!",
    photo: "https://via.placeholder.com/80"
  },
  {
    name: "Jane Smith",
    company: "GlobalTech",
    feedback: "Our HR department loves the simplicity and efficiency. Employee onboarding is a breeze now!",
    photo: "https://via.placeholder.com/80"
  },
  {
    name: "Michael Lee",
    company: "Innovate Solutions",
    feedback: "The analytics and reporting features save us so much time. A must-have tool for growing companies.",
    photo: "https://via.placeholder.com/80"
  }
];

const stats = [
  {
    icon: <UsersIcon className="w-12 h-12 text-primary mb-2" />,
    value: "500+",
    label: "Employees Managed"
  },
  {
    icon: <BuildingOffice2Icon className="w-12 h-12 text-primary mb-2" />,
    value: "120+",
    label: "Companies Trust Us"
  },
  {
    icon: <StarIcon className="w-12 h-12 text-primary mb-2" />,
    value: "4.9/5",
    label: "Customer Rating"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Our Clients Say
        </motion.h2>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              className="p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
              style={{ background: 'var(--background)', color: 'var(--foreground)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * idx }}
            >
              <img
                src={t.photo}
                alt={t.name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <p className="mb-4">"{t.feedback}"</p>
              <h4 className="text-lg font-semibold">{t.name}</h4>
              <p className="text-sm">{t.company}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center p-6 rounded-xl shadow"
              style={{ background: 'var(--background)', color: 'var(--foreground)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * idx }}
            >
              {s.icon}
              <h3 className="text-3xl font-bold">{s.value}</h3>
              <p>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
