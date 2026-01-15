"use client";

import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';

// Import images directly
import mockup1 from '../assets/mockup-1.png';
import mockup2 from '../assets/mockup-2.png';
import mockup3 from '../assets/mockup-3.png';
import mockup4 from '../assets/mockup-4.png';

const slides = [
    { id: 1, src: mockup1, alt: "Bienvenue sur Lexence", shadowColor: "rgba(232, 220, 192, 0.6)", bgColor: "rgb(232, 220, 192)" },
    { id: 2, src: mockup2, alt: "Mode Mini-Quiz", shadowColor: "rgba(228, 222, 242, 0.6)", bgColor: "rgb(228, 222, 242)" },
    { id: 3, src: mockup3, alt: "Suivi de progression", shadowColor: "rgba(200, 210, 220, 0.6)", bgColor: "rgb(200, 210, 220)" },
    { id: 4, src: mockup4, alt: "Définition de mots", shadowColor: "rgba(232, 220, 192, 0.6)", bgColor: "rgb(232, 220, 192)" }
];

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000); // Change every 4 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hero-carousel-container">
            <div className="hero-blob-animated"></div>

            <div className="carousel-frames">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                    >
                        <img
                            src={slide.src.src || slide.src}
                            alt={slide.alt}
                            className="slide-image"
                            style={{
                                '--slide-shadow': slide.shadowColor,
                                '--slide-bg': slide.bgColor
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Voir l'image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
