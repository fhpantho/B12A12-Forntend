import React from 'react';
import HeroPage from './HeroPage';
import AboutSection from './AboutSection';
import PackagesSection from './packages';
import FeaturesSection from './FeaturesSection'
import TestimonialsSection from './TestimonialsSection';
import ExtraSections from './ExtraSections';


const Home = () => {
    return (
        <div>
            <HeroPage/>
            <AboutSection/>
            <PackagesSection></PackagesSection>
            <FeaturesSection></FeaturesSection>
            <TestimonialsSection></TestimonialsSection>
            <ExtraSections></ExtraSections>
        </div>
    );
};

export default Home;