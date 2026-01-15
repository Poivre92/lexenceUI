import React, { useState, useEffect, useRef } from 'react';

const TypewriterEffect = ({ texts, minSpeed = 30, maxSpeed = 90, pauseDuration = 2000 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(minSpeed);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        let timer;
        const fullText = texts[currentTextIndex];

        const handleType = () => {
            const current = displayedText;

            // Determine next state
            let nextText = isDeleting
                ? fullText.substring(0, current.length - 1)
                : fullText.substring(0, current.length + 1);

            setDisplayedText(nextText);

            // Calculate speed
            let speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;

            if (isDeleting) {
                speed /= 2;
            } else {
                const char = nextText.slice(-1);
                if ([',', ';'].includes(char)) speed += 200;
                else if (['.', '!', '?'].includes(char)) speed += 400;
                if (Math.random() > 0.9) speed += 100;
            }

            // Check boundaries
            if (!isDeleting && nextText === fullText) {
                speed = pauseDuration;
                setIsDeleting(true);
            } else if (isDeleting && nextText === '') {
                setIsDeleting(false);
                let nextIndex = 0;
                if (texts.length > 1) {
                    do {
                        nextIndex = Math.floor(Math.random() * texts.length);
                    } while (nextIndex === currentTextIndex);
                }
                setCurrentTextIndex(nextIndex);
                speed = 500;
            }

            setTypingSpeed(speed);
        };

        timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayedText, isDeleting, currentTextIndex, typingSpeed]); // Controlled dependencies

    return (
        <span>
            {displayedText}
            <span className="typewriter-cursor">|</span>
        </span>
    );
};

export default TypewriterEffect;
