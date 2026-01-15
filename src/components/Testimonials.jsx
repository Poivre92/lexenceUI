"use client";

import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const testimonials = [
    {
        id: 1,
        name: "Alexandre V.",
        role: "Avocat au Barreau",
        text: "La précision des mots est mon outil de travail quotidien. Lexence m'a permis d'affiner mes plaidoiries avec une subtilité que je ne soupçonnais pas. Un outil d'une puissance insoupçonnée."
    },
    {
        id: 2,
        name: "Sophie D.",
        role: "Étudiante en Lettres Modernes",
        text: "Enfin une application qui ne nous infantilise pas ! Le design est apaisant, et chaque mot appris est une petite victoire sur la banalité. C'est devenu mon rituel du matin."
    },
    {
        id: 3,
        name: "Marc H.",
        role: "Directeur de Création",
        text: "L'esthétique de l'application est à la hauteur de son contenu. C'est du lourd : propre, intelligent, efficace. Je redécouvre le plaisir d'apprendre sans effort."
    },
    {
        id: 4,
        name: "Isabelle L.",
        role: "Journaliste",
        text: "Trouver le mot juste est un art. Lexence est le pinceau qu'il me manquait. L'algorithme d'espacement fonctionne vraiment, ces mots rares font désormais partie de mon vocabulaire naturel."
    },
    {
        id: 5,
        name: "Thomas B.",
        role: "Amoureux des mots",
        text: "Je pensais avoir un bon vocabulaire, j'ai réalisé à quel point la langue française est vaste. Chaque session est une leçon d'humilité et d'émerveillement. Indispensable."
    },
    {
        id: 6,
        name: "Claire M.",
        role: "Enseignante",
        text: "Je recommande Lexence à tous mes collègues. La rigueur des définitions couplée à la dimension ludique en fait le compagnon idéal pour quiconque souhaite élever son niveau de langue."
    },
    {
        id: 7,
        name: "Julien R.",
        role: "Entrepreneur",
        text: "Dans les affaires, la nuance fait souvent la différence. Lexence m'aide à structurer ma pensée avec plus de clarté et d'impact. Une application premium pour des esprits exigeants."
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 6000); // Rotate every 6 seconds
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="section testimonials-section">
            <div className="container">
                <div className="trust-header text-center">
                    <p className="trust-label">L'EXCELLENCE RECONNUE</p>
                    <h2 className="section-title">Ils cultivent leur différence</h2>
                    <div className="trust-badges">
                        <span className="badge">⭐ 4.9/5 sur l'App Store</span>
                        <span className="badge">🏆 Meilleure App Culture 2026</span>
                        <span className="badge">👥 +50 000 Esprits Libres</span>
                    </div>
                </div>

                <div className="carousel-container">
                    <div className="testimonials-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-slide">
                                <div className="testimonial-card">
                                    <div className="quote-icon">“</div>
                                    <p className="testimonial-text">{testimonial.text}</p>
                                    <div className="testimonial-author">
                                        <span className="author-name">{testimonial.name}</span>
                                        <span className="author-role">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="carousel-indicators">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Aller au témoignage ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="marketing-assurance text-center">
                    <p>Rejoignez le cercle de ceux qui maîtrisent l'art de la nuance.</p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
