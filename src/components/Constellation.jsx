import React, { useEffect, useRef, useState } from 'react';

const words = [
    { text: 'Melliflu', definition: 'Qui a la douceur du miel.', synonyms: ['Suave', 'Doucereux'] },
    { text: 'Éphémère', definition: 'Qui ne dure que peu de temps.', synonyms: ['Fugace', 'Passager'] },
    { text: 'Sempiternel', definition: 'Qui dure toujours.', synonyms: ['Continuel', 'Éternel'] },
    { text: 'Onirique', definition: 'Qui évoque un rêve.', synonyms: ['Fantastique', 'Irréel'] },
    { text: 'Sybillin', definition: 'Dont le sens est obscur.', synonyms: ['Mystérieux', 'Énigmatique'] },
    { text: 'Vespéral', definition: 'Qui se rapporte au soir.', synonyms: ['Crépusculaire'] },
    { text: 'Pétricor', definition: 'Odeur de la terre après la pluie.', synonyms: ['Nébulosité'] },
    { text: 'Icône', definition: 'Représentation sacrée.', synonyms: ['Symbole'] },
    { text: 'Zénith', definition: 'Point culminant.', synonyms: ['Apogée', 'Sommet'] },
    { text: 'Quintessence', definition: 'L\'essence la plus pure.', synonyms: ['Cœur', 'Substantifique'] },
    { text: 'Sérénité', definition: 'État de calme.', synonyms: ['Plénitude', 'Quiétude'] },
    { text: 'Évanescent', definition: 'Qui disparaît par degrés.', synonyms: ['Filant'] },
];

const Constellation = () => {
    const canvasRef = useRef(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const pointsRef = useRef([]);
    const rotationRef = useRef({ x: 0, y: 0 });
    const projectedPointsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Initialize points in a sphere
        pointsRef.current = words.map((w, i) => {
            const phi = Math.acos(-1 + (2 * i) / words.length);
            const theta = Math.sqrt(words.length * Math.PI) * phi;
            return {
                word: w,
                x: 180 * Math.cos(theta) * Math.sin(phi),
                y: 180 * Math.sin(theta) * Math.sin(phi),
                z: 180 * Math.cos(phi),
            };
        });

        const handleResize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Update rotation based on mouse orientation (simple inertia)
            rotationRef.current.x += (mousePos.y * 0.0001 - rotationRef.current.x) * 0.05;
            rotationRef.current.y += (mousePos.x * 0.0001 - rotationRef.current.y) * 0.05;

            ctx.save();
            ctx.translate(centerX, centerY);

            // Draw central Fleur-de-lys (Vector)
            ctx.beginPath();
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 800) * 0.2;

            // Fleur-de-lys drawing logic
            const drawFleur = (s) => {
                ctx.moveTo(0, -35 * s);
                ctx.bezierCurveTo(20 * s, -35 * s, 20 * s, 0, 0, 15 * s);
                ctx.bezierCurveTo(-20 * s, 0, -20 * s, -35 * s, 0, -35 * s);
                // Lateral petals
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(25 * s, -10 * s, 30 * s, 10 * s, 5 * s, 15 * s);
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-25 * s, -10 * s, -30 * s, 10 * s, -5 * s, 15 * s);
            };
            drawFleur(1);
            ctx.stroke();

            // Temp array for hit detection
            const currentProjected = [];

            // Render words
            pointsRef.current.forEach((p) => {
                // Rotation Y
                const cosY = Math.cos(rotationRef.current.y + Date.now() * 0.0004);
                const sinY = Math.sin(rotationRef.current.y + Date.now() * 0.0004);
                const x1 = p.x * cosY - p.z * sinY;
                const z1 = p.x * sinY + p.z * cosY;

                // Rotation X
                const cosX = Math.cos(rotationRef.current.x);
                const sinX = Math.sin(rotationRef.current.x);
                const y1 = p.y * cosX - z1 * sinX;
                const z2 = p.y * sinX + z1 * cosX;

                // Perspective projection
                const scale = 450 / (450 + z2);
                const px = x1 * scale;
                const py = y1 * scale;

                currentProjected.push({ word: p.word, px, py, z: z2 });

                // Style
                const isSelected = selectedWord?.text === p.word.text;
                ctx.globalAlpha = isSelected ? 1 : (z2 + 200) / 450;
                ctx.fillStyle = isSelected ? '#D4AF37' : '#4A4A4A';
                ctx.font = `${isSelected ? 'bold ' : ''}${Math.max(12, 16 * scale)}px "Outfit", sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(p.word.text, px, py);

                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(px, py + 5, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            projectedPointsRef.current = currentProjected;
            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [mousePos, selectedWord]);

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        setMousePos({ x: mx, y: my });

        // Hit detection
        let found = null;
        projectedPointsRef.current.forEach(p => {
            const dx = mx - p.px;
            const dy = my - p.py;
            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                if (!found || p.z < found.z) found = p;
            }
        });
        if (found) setSelectedWord(found.word);
        else if (selectedWord) setSelectedWord(null); // Clear selection if no word is hovered
    };

    return (
        <div className="constellation-container" style={{ position: 'relative', width: '100%', height: '450px' }}>
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                style={{ cursor: 'crosshair', display: 'block', width: '100%', height: '100%' }}
            />

            <div className="nuance-info" style={{
                position: 'absolute',
                top: '50%',
                right: '40px',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 253, 248, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                width: '300px',
                pointerEvents: 'none',
                opacity: selectedWord ? 1 : 0.8,
                transition: 'all 0.4s ease',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                zIndex: 20
            }}>
                <div style={{ borderLeft: '3px solid #D4AF37', paddingLeft: '1rem' }}>
                    <h4 style={{
                        margin: '0 0 0.2rem 0',
                        color: '#D4AF37',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.4rem',
                        letterSpacing: '1px'
                    }}>
                        {selectedWord ? selectedWord.text : 'Constellation'}
                    </h4>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        Nuance & Racine
                    </p>
                </div>

                {selectedWord ? (
                    <div className="reveal-content" style={{ animation: 'fadeIn 0.5s ease' }}>
                        <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#444', lineHeight: '1.6' }}>
                            {selectedWord.definition}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {selectedWord.synonyms.map(s => (
                                <span key={s} style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 10px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    color: '#B8860B',
                                    borderRadius: '20px',
                                    fontWeight: '600'
                                }}>{s}</span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontStyle: 'italic', lineHeight: '1.6' }}>
                        Déplacez votre curseur sur les étoiles pour capturer la quintessence des mots.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Constellation;
