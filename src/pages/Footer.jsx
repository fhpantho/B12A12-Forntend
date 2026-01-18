import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  // Scroll to top handler
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={handleScrollTop}
        className="fixed bottom-8 right-8 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-all"
        aria-label="Scroll to top"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </button>
      <footer className="py-10" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">

        {/* Contact Details */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p>Email: fahim1020pantho@gmail.com</p>
          <p>WhatsApp: +8801786397788</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/f.h.pantho" className="hover:text-primary"><FaFacebookF /></a>
            <a href="https://x.com/FHPantho" className="hover:text-primary"><FaTwitter /></a>
            <a href="https://www.linkedin.com/in/fhpantho" className="hover:text-primary"><FaLinkedinIn /></a>
            
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
          <p style={{ color: 'var(--foreground)' }}>&copy; {new Date().getFullYear()} AssetVerse. All rights reserved.</p>
        </div>

      </div>
    </footer>
    </>
  );
};

export default Footer;
