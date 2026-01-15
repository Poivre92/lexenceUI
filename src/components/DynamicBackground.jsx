"use client";

import React, { useEffect, useState, useRef } from 'react';
import './DynamicBackground.css';

const RARE_WORDS = [
    "Sempiternel", "Melliflu", "Pétrichor", "Velléité",
    "Diaphane", "Éphémère", "Ineffable", "Sérendipité",
    "Zéphyr", "Laconique", "Obnubiler", "Quintessence",
    "Réminiscence", "Solastalgie", "Sonate", "Idylle",
    "Céladon", "Irisé", "Nitescence", "Rocambolesque"
];

const DynamicBackground = () => {
    const [words, setWords] = useState([]);
    const [theme, setTheme] = useState('light');
    const canvasRef = useRef(null);
    const wordsRef = useRef([]); // To track words without re-renders for logic if needed

    // Word Animation Logic
    useEffect(() => {
        const createWord = () => {
            const word = RARE_WORDS[Math.floor(Math.random() * RARE_WORDS.length)];
            const id = Math.random().toString(36).substr(2, 9);

            // Randomize layer for depth
            const rand = Math.random();
            let zIndex, opacity, blur, fontSizeScale;

            if (rand < 0.6) { // Background
                zIndex = 5;
                opacity = 0.12;
                blur = '1px';
                fontSizeScale = 1;
            } else if (rand < 0.9) { // Midground (in front of phone)
                zIndex = 20;
                opacity = 0.15;
                blur = '0.5px';
                fontSizeScale = 1.2;
            } else { // Close Foreground (out of focus)
                zIndex = 40;
                opacity = 0.08;
                blur = '4px';
                fontSizeScale = 2;
            }

            const style = {
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animationDuration: `${25 + Math.random() * 15}s`, // Even slower
                fontSize: `${1.2 * fontSizeScale + Math.random()}rem`,
                zIndex: zIndex,
                opacity: opacity,
                filter: `blur(${blur})`,
                '--move-y': `${-50 - Math.random() * 100}px`, // Dynamic float height
                '--base-opacity': opacity
            };
            return { id, text: word, style };
        };

        // Initial words - increased for immersion
        setWords(Array.from({ length: 18 }, createWord));

        const interval = setInterval(() => {
            setWords(prevWords => {
                // Recycle words: Remove one random, add one random
                const nextWords = [...prevWords];
                const removeIndex = Math.floor(Math.random() * nextWords.length);
                const newWord = createWord();
                // Replace to keep DOM stable-ish or just push/filter. 
                // Replacing at index keeps count stable.
                nextWords[removeIndex] = newWord;
                return nextWords;
            });
        }, 4000); // Change a word every 4 seconds

        return () => clearInterval(interval);
    }, []);

    // Theme Observer
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    setTheme(document.documentElement.getAttribute('data-theme') || 'light');
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        setTheme(document.documentElement.getAttribute('data-theme') || 'light');

        return () => observer.disconnect();
    }, []);

    // Ink/Feather Mouse Trail Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Resize canvas
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        const createParticle = (x, y) => {
            particles.push({
                x,
                y,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5 - 0.5,
                life: 1.0,
                decay: 0.01 + Math.random() * 0.01
            });
        };

        const handleMouseMove = (e) => {
            for (let i = 0; i < 2; i++) {
                createParticle(e.clientX, e.clientY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get color based on theme
            const particleColor = theme === 'dark' ? '197, 165, 114' : '106, 123, 156'; // Gold vs Blue

            particles.forEach((p, index) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.life -= p.decay;

                if (p.life <= 0) {
                    particles.splice(index, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${particleColor}, ${p.life * (theme === 'dark' ? 0.3 : 0.2)})`;
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-run effect when theme changes to ensure color update

    return (
        <div className="dynamic-background">
            <canvas ref={canvasRef} className="ink-canvas" />
            {words.map(word => (
                <span key={word.id} className="floating-word" style={word.style}>
                    {word.text}
                </span>
            ))}
        </div>
    );
};

export default DynamicBackground;
