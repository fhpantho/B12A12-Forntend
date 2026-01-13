import React from 'react';
import { Outlet } from 'react-router';

import Footer from '../pages/Footer';
import Navbar from '../pages/Navbar';

const RootLayout = () => {
    return (
        <div>
            <header>
                <Navbar></Navbar>
            </header>
            {/* Spacer for sticky navbar */}
            <div style={{ height: '72px' }}></div>
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