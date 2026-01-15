import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import './Hero.css';
import heroMockup from '../assets/hero-clay-mockup.png';
import Reveal from './Reveal';
import TypewriterEffect from './TypewriterEffect';
import DownloadButtons from './DownloadButtons';
import AnimatedTitle from './AnimatedTitle';
import gsap from 'gsap';

const Hero = () => {
    const subtitleRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        // Animate subtitle
        gsap.fromTo(subtitleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, delay: 1.2, ease: "power3.out" }
        );

        // Animate buttons
        gsap.fromTo(buttonsRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "back.out(1.7)" }
        );
    }, []);

    return (
        <section className="hero">
            {/* Background shapes */}
            <div className="hero-background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="container hero-container">
                <Reveal delay={0.1}>
                    <div className="hero-content">
                        <AnimatedTitle
                            text="Cultivez l'art de l'expression française"
                            className="hero-title"
                        />
                        <div ref={subtitleRef} className="hero-subtitle">
                            <TypewriterEffect
                                texts={[
                                    "Un swipe, un mot, une victoire. Relevez le défi Lexence : progressez à travers les niveaux, débloquez des mini-jeux et transformez votre apprentissage en un véritable moment de plaisir.",
                                    "Enrichissez votre vocabulaire quotidiennement avec Lexence. Une expérience d'apprentissage ludique et innovante, conçue pour les amoureux de la langue de Molière.",
                                    "Ne laissez plus vos mots s'envoler. Grâce à la méthode scientifique de Leitner et nos cartes intuitives, Lexence optimise votre mémoire pour un vocabulaire ancré durablement. À vous de jouer !"
                                ]}
                                minSpeed={30}
                                maxSpeed={70}
                                pauseDuration={4000}
                            />
                        </div>

                        <div ref={buttonsRef} className="hero-platforms">
                            <p className="platforms-label">Disponible sur</p>
                            <DownloadButtons />
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.3}>
                    <div className="hero-image-wrapper">
                        <Image src={heroMockup} alt="Lexence App Interface" className="hero-clay-mockup" placeholder="blur" priority />
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default Hero;
