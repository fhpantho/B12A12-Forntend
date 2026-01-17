import React from 'react';
import HeroPage from './HeroPage';
import AboutSection from './AboutSection';
import PackagesSection from './PackagesSection';
import FeaturesSection from './FeaturesSection'
import TestimonialsSection from './TestimonialsSection';
import ExtraSections from './ExtraSections';
import Blogs from '../components/Blogs';
import Statistics from '../components/Statistics';


const Home = () => {
    return (
        <div>
            <HeroPage/>
            <AboutSection/>
            <PackagesSection></PackagesSection>
            <FeaturesSection></FeaturesSection>
            <TestimonialsSection></TestimonialsSection>
            <Blogs></Blogs>
            <Statistics></Statistics>
            <ExtraSections></ExtraSections>
        </div>
    );
};

export default Home;