"use client";

import React, { useState } from 'react';
import './BetaPage.css';
import DynamicBackground from '../../components/DynamicBackground';

export default function BetaInvitationPage() {
    const [email, setEmail] = useState('');
    const [honey, setHoney] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/beta-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, honey }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage("Merci. Votre inscription est validée. Vous recevrez prochainement votre accès exclusif par email.");
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || "Une erreur est survenue.");
            }
        } catch (error) {
            setStatus('error');
            setMessage("Erreur de connexion.");
        }
    };

    return (
        <div className="beta-page">
            <DynamicBackground />

            <div className="beta-content">
                <div className="beta-logo">Lexence.</div>

                <div className="beta-card">
                    <span className="beta-label">Accès Anticipé</span>
                    <h1 className="beta-title">L'art des mots,<br />avant tout le monde.</h1>
                    <p className="beta-description">
                        Rejoignez le cercle restreint des bêta-testeurs. Participez à l'élaboration de la référence culturelle de demain et accédez aux fonctionnalités exclusives.
                    </p>

                    <form onSubmit={handleSubmit} className="beta-form">
                        <div className="input-group">
                            <input
                                type="text"
                                name="phone_number"
                                className="visually-hidden"
                                tabIndex={-1}
                                autoComplete="off"
                                onChange={(e) => setHoney(e.target.value)}
                            />
                            <input
                                type="email"
                                className="beta-input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={status === 'loading' || status === 'success'}
                            />
                        </div>

                        <button
                            type="submit"
                            className="beta-submit"
                            disabled={status === 'loading' || status === 'success'}
                        >
                            {status === 'loading' ? <div className="spinner"></div> :
                                status === 'success' ? 'Inscrit ✔' : 'Obtenir mon invitation'}
                        </button>

                        {message && (
                            <div className={`form-message ${status === 'success' ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                <p style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6 }}>
                    &copy; {new Date().getFullYear()} Lexence. Invitation confidentielle.
                </p>
            </div>
        </div>
    );
}
