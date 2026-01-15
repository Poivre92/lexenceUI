import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './WhyLexence.css';
import Reveal from './Reveal';

const features = [
    {
        id: "01",
        title: "Éloquence & Précision",
        description: "Accédez à une sélection rigoureuse de termes rares et littéraires pour affiner votre discours et capturer chaque nuance de votre pensée.",
        icon: "🪶",
        size: "large",
        hoverContent: {
            title: "Le Mot Juste",
            text: "Une des plus grandes bibliothèques de vocabulaire avec plus de 50 000 termes, définis et choisis pour vous."
        }
    },
    {
        id: "02",
        title: "Système de Leitner",
        description: "Optimisez votre mémorisation grâce à la répétition espacée. Notre algorithme identifie vos lacunes pour ancrer le vocabulaire durablement.",
        icon: "🧠",
        size: "standard", // Changed from medium to standard for 3-col grid
        hoverContent: {
            title: "La Méthode Leitner",
            text: "Organisez vos cartes mémoire en niveaux pour une mémorisation durable. Révisez moins souvent les cartes connues pour une efficacité maximale, suivant le principe de répétition espacée de Sebastian Leitner."
        }
    },
    {
        id: "03",
        title: "Sérénité Cognitive",
        description: "Un environnement minimaliste et sans distraction, pour une concentration totale.",
        icon: "✨",
        visual: <Image src="/images/serenity_vector.jpg" alt="Sérénité" className="bento-center-visual" width={140} height={140} />,
        size: "small", // Maps to standard/small in CSS
        hoverContent: {
            title: "Focus Absolu",
            text: "Zéro publicité, zéro distraction visuelle."
        }
    },
    {
        id: "04",
        title: "Défi d'Excellence",
        description: "Relevez des défis quotidiens pour atteindre l'excellence linguistique.",
        icon: "🏆",
        visual: <Image src="/images/challenge_vector.jpg" alt="Excellence" className="bento-center-visual" width={140} height={140} />,
        size: "small", // Maps to standard/small in CSS
        hoverContent: {
            title: "Progression",
            text: "Gagnez des badges et mesurez votre éloquence."
        }
    },
    {
        id: "05",
        title: "Swipe Intuitif",
        description: "Mémorisez vos mots d'un simple geste. Une interface fluide conçue pour un apprentissage naturel et addictif.",
        icon: "🖐️", // Keeping emoji as icon, visual is separate
        visual: (
            <div className="swipe-visual-wrapper">
                <Image src="/images/swipe_vector.jpg" alt="Swipe" className="bento-center-visual" width={140} height={140} />
            </div>
        ),
        size: "standard", // Changed from vertical to standard for 3-col grid
        hoverContent: {
            title: "Apprentissage Tactile",
            text: "Glissez à droite pour valider, à gauche pour réviser. L'élégance du geste au service de la mémoire."
        }
    }
];

// Custom component for the Ancrage Mémoriel animation
const MemoryAnchorVisual = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev < 5 ? prev + 1 : 0));
        }, 1500); // Slightly slower for elegance
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="memory-anchor-visual">
            <div className="progress-track">
                {/* Connecting line */}
                <div className="track-line"></div>
                {/* Steps */}
                {[1, 2, 3, 4].map((step, index) => (
                    <div
                        key={step}
                        className={`step-circle step-${step} ${index < activeStep ? 'active' : ''}`}
                    >
                        <span className="step-dot"></span>
                    </div>
                ))}
            </div>
            <p className="validation-text">4 étapes de validation pour une mémorisation parfaite.</p>
        </div>
    );
};

const MockupVisual = ({ isHovered }) => {
    return (
        <div className={`mockup-visual ${isHovered ? 'active' : ''}`}>
            <div className="mockup-phone-frame">
                <div className="mockup-screen">
                    <Image src="/images/mockup_app.jpg" alt="Interface Lexence" className="mockup-img" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" />
                </div>
            </div>
            <div className="mockup-glow"></div>
        </div>
    );
};

import { useSound } from '../hooks/useSound';

const BentoCard = ({ feature }) => {
    const [isHovered, setIsHovered] = useState(false);
    const playClick = useSound('/sounds/click.mp3');

    const handleMouseEnter = () => {
        setIsHovered(true);
        playClick();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsHovered(!isHovered);
            playClick();
        } else if (e.key === 'Escape') {
            setIsHovered(false);
        }
    };

    return (
        <div
            className={`bento-card ${feature.id !== "01" ? 'is-frameless' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                setIsHovered(!isHovered);
                playClick();
            }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={isHovered}
            aria-haspopup="true"
        >
            <div className="bento-header">
                <span className="bento-id">{feature.id}</span>
                <div className="bento-icon-wrapper">{feature.icon}</div>
            </div>
            <div className="bento-body">
                {/* Special integration for Ancrage Mémoriel */}
                {feature.title === "Système de Leitner" ? (
                    <>
                        <div className="bento-content-top">
                            <MemoryAnchorVisual />
                        </div>
                        <div className="bento-content-bottom">
                            <h3 className="bento-title">{feature.title}</h3>
                            <p className="bento-description">{feature.description}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bento-visual-default">
                            {feature.visual ? (
                                feature.visual
                            ) : feature.id === "01" ? (
                                <Image src="/images/statue_cicero_vector.jpg" alt="Éloquence" className="bento-statue-img" width={200} height={260} style={{ width: 'auto', height: 'auto', maxHeight: '260px' }} />
                            ) : null}
                        </div>
                        <div className="bento-text-content">
                            <h3 className="bento-title">{feature.title}</h3>
                            <p className="bento-description">{feature.description}</p>
                        </div>
                    </>
                )}
            </div>

            {/* Standard popup for other cards */}
            <div className={`bento-popup ${isHovered ? 'active' : ''} ${feature.title === "Éloquence & Précision" || feature.title === "Système de Leitner" || feature.title === "Swipe Intuitif" ? 'with-mockup' : ''}`}>
                <div className="popup-content">
                    {feature.title === "Éloquence & Précision" ? (
                        <div className="mockup-layout">
                            <div className="mockup-text-side">
                                <span className="popup-icon">{feature.icon}</span>
                                <h4 className="popup-title">{feature.hoverContent.title}</h4>
                                <p className="popup-text">{feature.hoverContent.text}</p>
                            </div>
                            <div className="mockup-visual-side">
                                <MockupVisual isHovered={isHovered} />
                            </div>
                        </div>
                    ) : feature.title === "Système de Leitner" ? (
                        <div className="leitner-layout">
                            <div className="leitner-visual-side">
                                <img src="/images/leitner_method.png" alt="Méthode Leitner" className="leitner-img" />
                            </div>
                            <div className="leitner-text-side">
                                <h4 className="popup-title">{feature.hoverContent.title}</h4>
                                <p className="popup-text">{feature.hoverContent.text}</p>
                            </div>
                        </div>
                    ) : feature.title === "Swipe Intuitif" ? (
                        <div className="swipe-layout">
                            <div className="swipe-visual-side">
                                <div className="swipe-gif-container">
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="swipe-gif"
                                        poster="/images/swipe_demo.gif"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                                    >
                                        <source src="/videos/swipe_demo.mp4" type="video/mp4" />
                                        <img src="/images/swipe_demo.gif" alt="Démo Swipe" />
                                    </video>
                                    <div className="swipe-overlay-hand">👆</div>
                                </div>
                            </div>
                            <div className="swipe-text-side">
                                <h4 className="popup-title">{feature.hoverContent.title}</h4>
                                <p className="popup-text">{feature.hoverContent.text}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="popup-icon">{feature.icon}</span>
                            <h4 className="popup-title">{feature.hoverContent.title}</h4>
                            <p className="popup-text">{feature.hoverContent.text}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const WhyLexence = () => {
    return (
        <section id="why" className="section why-section">
            <div className="container">
                <Reveal>
                    <div className="why-header">
                        <span className="why-label">L'Expérience Lexence</span>
                        <h2 className="section-title">Pourquoi nous choisir ?</h2>
                        <p className="section-subtitle">
                            L'alliance de la science cognitive et de l'élégance littéraire pour une maîtrise sans compromis.
                        </p>
                    </div>
                </Reveal>

                <div className="bento-grid">
                    {features.map((feature, index) => (
                        <Reveal key={index} delay={index * 0.15} className={`bento-item ${feature.size}`}>
                            <BentoCard feature={feature} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyLexence;
