import React from 'react';
import HeroPage from './HeroPage';
import AboutSection from './AboutSection';
import PackagesSection from './packages';
import FeaturesSection from './FeaturesSection'
import TestimonialsSection from './TestimonialsSection';


const Home = () => {
    return (
        <div>
            <HeroPage/>
            <AboutSection/>
            <PackagesSection></PackagesSection>
            <FeaturesSection></FeaturesSection>
            <TestimonialsSection></TestimonialsSection>
        </div>
    );
};

export default Home;