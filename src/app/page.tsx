"use client";

import Header from '../components/Header';
import DynamicBackground from '../components/DynamicBackground';
import Hero from '../components/Hero';
import WhyLexence from '../components/WhyLexence';
import Footer from '../components/Footer';

import dynamic from 'next/dynamic';

const Features = dynamic(() => import('../components/Features'), { loading: () => <p></p> });
const IdeaSection = dynamic(() => import('../components/IdeaSection'), { loading: () => <p></p> });
const Testimonials = dynamic(() => import('../components/Testimonials'), { loading: () => <p></p> });
import LoadingScreen from '../components/LoadingScreen';

export default function Home() {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <LoadingScreen />
            <DynamicBackground />
            <div style={{ position: 'relative', zIndex: 1 }}>
                <Header />
                <Hero />
                <WhyLexence />
                <Features />
                <IdeaSection />
                <Testimonials />
                <Footer />
            </div>
        </div>
    );
}
