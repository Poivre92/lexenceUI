import { useState } from 'react'
import Header from './components/Header'
import DynamicBackground from './components/DynamicBackground'
import Hero from './components/Hero'
import WhyLexence from './components/WhyLexence'
import Features from './components/Features'
import IdeaSection from './components/IdeaSection'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <DynamicBackground />
            <div style={{ position: 'relative', zIndex: 10 }}>
                <Header />
                <Hero />
                <WhyLexence />
                <Features />
                <IdeaSection />
                <Testimonials />
                <Footer />
            </div>
        </div>
    )
}

export default App
