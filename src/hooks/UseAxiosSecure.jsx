import axios from 'axios';
import React from 'react';

const axiossecure = axios.create({
    baseURL : "https://assetsverse.vercel.app"
})

const UseAxiosSecure = () => {
    return axiossecure
};

export default UseAxiosSecure;