import React from 'react';
import { NavLink } from 'react-router';

const Error404 = () => {
    return (
        <div className="flex flex-col w-full items-center justify-normal h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <img
          src="https://i.ibb.co.com/gbF7mHMq/Pngtree-site-404-error-page-3407766.png"
          alt="Loading..."
          className="w-[30%]  mb-4"
        />
        <p className="font-medium">404 Page not Found</p>
        <h1>lets Go  <NavLink to = "/" className="btn">Home</NavLink></h1>
      </div>
    );
};

export default Error404;