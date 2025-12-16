import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">

        {/* Contact Details */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p>Email: support@assetverse.com</p>
          <p>Phone: +880 123 456 789</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-primary"><FaFacebookF /></a>
            <a href="#" className="hover:text-primary"><FaTwitter /></a>
            <a href="#" className="hover:text-primary"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-primary"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/emregistration" className="hover:text-primary">Join as Employee</Link></li>
            <li><Link to="/hrregistration" className="hover:text-primary">Join as HR Manager</Link></li>
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-4">AssetVerse</h3>
          <p className="text-gray-400">&copy; {new Date().getFullYear()} AssetVerse. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
