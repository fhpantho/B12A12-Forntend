import React from 'react';
import { Outlet } from 'react-router';

const RootLayout = () => {
    return (
        <div>
            <header>

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