import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AnimatedTitle = ({ text, className }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Split text into letters
        const chars = text.split('').map((char, i) => {
            if (char === ' ') return <span key={i}>&nbsp;</span>;
            return <span key={i} className="char">{char}</span>;
        });

        // Clear and set new content
        // Note: For SSR/Next.js compatibility, we might want to handle this differently,
        // but for a client-side component, this is fine.

        const charsElements = container.querySelectorAll('.char');

        gsap.fromTo(charsElements,
            {
                opacity: 0,
                y: 50,
                rotateX: -90,
                filter: 'blur(10px)'
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                duration: 1.5,
                stagger: 0.05,
                ease: "power4.out",
                delay: 0.5
            }
        );

        // Subtle floating animation for each letter
        charsElements.forEach((char, i) => {
            gsap.to(char, {
                y: "random(-5, 5)",
                x: "random(-2, 2)",
                rotate: "random(-2, 2)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.1
            });
        });

    }, [text]);

    return (
        <h1 ref={containerRef} className={className}>
            {text.split('').map((char, i) => (
                <span key={i} className={char === ' ' ? '' : 'char'} style={{ display: 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    );
};

export default AnimatedTitle;
