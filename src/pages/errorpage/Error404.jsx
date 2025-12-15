import React from 'react';
import { NavLink } from 'react-router';

const Error404 = () => {
    return (
        <div className="flex flex-col items-center justify-normal h-screen">
        <img
          src="https://i.gifer.com/45Ra.gif"
          alt="Loading..."
          className="w-80%  mb-4"
        />
        <p className="text-gray-600 font-medium">404 Page not Found</p>
        <h1>lets Go  <NavLink to = "/">Home</NavLink></h1>
      </div>
    );
};

export default Error404;