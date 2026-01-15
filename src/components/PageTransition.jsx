'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

const PageTransition = ({ children }) => {
    const containerRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Reset opacity for the new transition
        gsap.set(container, { opacity: 0, y: 10 });

        // Animate in
        gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all"
        });
    }, [pathname]);

    return (
        <div ref={containerRef} style={{ opacity: 0 }}>
            {children}
        </div>
    );
};

export default PageTransition;
