import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // We wait for a minimum time or until window is loaded
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setVisible(false), 800); // Match CSS transition duration
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loading-content">
                <h1 className="loading-logo">Lexence.</h1>
                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>
                <p className="loading-tagline">L'élégance du mot juste</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
