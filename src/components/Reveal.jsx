import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, threshold = 0.1, delay = 0, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: threshold,
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const style = {
        transitionDelay: `${delay}s`,
    };

    return (
        <div
            ref={ref}
            className={`reveal fade-up ${isVisible ? 'is-visible' : ''} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

export default Reveal;
