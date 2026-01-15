'use client';

import { useCallback } from 'react';

export const useSound = (url) => {
    const play = useCallback(() => {
        const audio = new Audio(url);
        audio.volume = 0.15; // Extremely subtle
        audio.play().catch(e => console.log("Sound play prevented by browser policy", e));
    }, [url]);

    return play;
};
