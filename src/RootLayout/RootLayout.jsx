import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Footer';

const RootLayout = () => {
    return (
        <div>
            <header>
                <Navbar></Navbar>
            </header>
            <main>
                <Outlet></Outlet>
            </main>
            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default RootLayout;