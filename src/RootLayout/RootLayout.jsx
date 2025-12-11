import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Navbar';

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
                
            </footer>
        </div>
    );
};

export default RootLayout;