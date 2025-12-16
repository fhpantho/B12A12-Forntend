import React from 'react';
import HeroPage from './HeroPage';
import AboutSection from './AboutSection';
import PackagesSection from './packages';


const Home = () => {
    return (
        <div>
            <HeroPage/>
            <AboutSection/>
            <PackagesSection></PackagesSection>
        </div>
    );
};

export default Home;