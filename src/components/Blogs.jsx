import React from "react";
import { motion } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "Why Asset Management Is Crucial for Modern Companies",
    author: "AssetVerse Team",
    date: "Jan 05, 2026",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    description:
      "Efficient asset management helps organizations reduce costs, improve accountability, and increase productivity across teams.",
  },
  {
    id: 2,
    title: "HR Best Practices for Tracking Employee Assets",
    author: "HR Insights",
    date: "Jan 10, 2026",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    description:
      "Learn how HR managers can track, assign, and recover company assets efficiently using digital tools.",
  },
  {
    id: 3,
    title: "Digital Asset Requests: Simplifying Employee Workflows",
    author: "AssetVerse Team",
    date: "Jan 12, 2026",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    description:
      "Online asset request systems eliminate paperwork, reduce delays, and improve transparency between HR and employees.",
  },
];

const Blogs = () => {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary">
            AssetVerse Blogs
          </h1>
          <p className="text-base-content/70 mt-3 max-w-2xl mx-auto">
            Insights, best practices, and guides on asset management, HR
            workflows, and workplace productivity.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
            >
              <figure>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title text-lg">
                  {blog.title}
                </h2>

                <div className="text-sm text-base-content/60">
                  <span>{blog.author}</span> · <span>{blog.date}</span>
                </div>

                <p className="text-base-content/80">
                  {blog.description}
                </p>

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-sm btn-primary">
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
