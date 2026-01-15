import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './Features.css';
import Reveal from './Reveal';

const games = [
    {
        name: "Mini-Quiz",
        desc: "Testez vos connaissances avec des définitions précises.",
        id: "quiz"
    },
    {
        name: "Chasse aux Synonymes",
        desc: "Distinguez la nuance en trouvant le mot juste.",
        id: "synonym"
    },
    {
        name: "Le Mot Manquant",
        desc: "L'art de compléter la phrase avec élégance.",
        id: "missing"
    },
    {
        name: "Défi des Lettres",
        desc: "Reconstituez le mot lettre après lettre.",
        id: "letters"
    },
    {
        name: "Les Mots Croisés",
        desc: "Retrouvez vos mots appris pour les ancrer durablement.",
        id: "crossword"
    }
];

import { useSound } from '../hooks/useSound';

const Features = () => {
    const [activeGame, setActiveGame] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const playSwitch = useSound('/sounds/click.mp3');

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setActiveGame((prev) => (prev + 1) % games.length);
            }, 5000); // Change every 5 seconds
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const handleGameClick = (index) => {
        setActiveGame(index);
        setIsAutoPlaying(false); // Stop auto-rotation on user interaction
        playSwitch();
    };

    return (
        <section id="features" className="section features-section">
            <div className="container">
                <div className="features-layout">
                    <div className="features-content">
                        <Reveal>
                            <h2 className="section-title">Maîtrise Ludique</h2>
                            <p className="section-description">
                                Apprendre ne doit pas être une corvée. Découvrez nos mini-jeux conçus pour ancrer chaque mot dans votre mémoire tout en vous amusant.
                            </p>
                        </Reveal>

                        <ul className="games-list">
                            {games.map((game, index) => (
                                <Reveal key={game.id} delay={index * 0.1}>
                                    <li
                                        className={`game-item ${index === activeGame ? 'active' : ''}`}
                                        onClick={() => handleGameClick(index)}
                                    >
                                        <span className="game-bullet">•</span>
                                        <div>
                                            <strong className="game-name">{game.name}</strong>
                                            <p className="game-desc">{game.desc}</p>
                                        </div>
                                        {index === activeGame && (
                                            <div className="game-progress-bar">
                                                <div className="progress-fill" style={{ animationDuration: '5s' }}></div>
                                            </div>
                                        )}
                                    </li>
                                </Reveal>
                            ))}
                        </ul>
                    </div>

                    <div className="features-visual">
                        <Reveal delay={0.3}>
                            <div className="phone-mockup-abstract">
                                <div className="mockup-frame">
                                    <div className="mockup-screen-gif">
                                        <video
                                            key={games[activeGame].id}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="game-gif"
                                            poster={`/images/minigames/${games[activeGame].id}.gif`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                                        >
                                            <source src={`/videos/minigames/${games[activeGame].id}.mp4`} type="video/mp4" />
                                            {/* Fallback to GIF if video fails or doesn't exist yet */}
                                            <img
                                                src={`/images/minigames/${games[activeGame].id}.gif`}
                                                alt={games[activeGame].name}
                                            />
                                        </video>
                                        <div className="gif-overlay-interaction">
                                            <span className="interaction-badge">
                                                {activeGame === 0 ? "❓" :
                                                    activeGame === 1 ? "🎯" :
                                                        activeGame === 2 ? "✍️" :
                                                            activeGame === 3 ? "🧩" : "▦"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
