"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './IdeaSection.css';
import SkeletonIdea from './SkeletonIdea';

const IdeaSection = () => {
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchIdeas = async () => {
        try {
            const response = await fetch('/api/ideas');
            const data = await response.json();
            setIdeas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            // Small artificial delay for smoother transition with skeleton
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    useEffect(() => {
        fetchIdeas();
    }, []);

    const normalizeStatus = (status) => {
        return status?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ /g, '-')
            .replace(/'/g, '-') || 'a-l-etude';
    };

    return (
        <section id="ideas" className="section idea-section">
            <div className="container">
                <div className="idea-content">
                    <h2 className="section-title text-center">Votre Voix Compte</h2>
                    <p className="section-subtitle text-center">
                        Lexence évolue avec vous. Proposez des fonctionnalités, votez pour vos favorites
                        et façonnez l'avenir de l'application.
                    </p>

                    <div className="idea-mockup">
                        <div className="mockup-header">
                            <span className="mockup-title">Suggestions Populaires</span>
                        </div>
                        <div className="idea-list">
                            {isLoading ? (
                                <>
                                    <SkeletonIdea />
                                    <SkeletonIdea />
                                    <SkeletonIdea />
                                </>
                            ) : ideas.length > 0 ? (
                                ideas.map((idea) => (
                                    <div key={idea.id} className="idea-item">
                                        <div className="idea-info">
                                            <span className="idea-title">{idea.title}</span>
                                            <span className={`idea-status status-${normalizeStatus(idea.status)}`}>
                                                {idea.status}
                                            </span>
                                        </div>
                                        <div className="idea-votes">
                                            <span>▲</span> {idea.vote_count || 0}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-ideas">Aucune idée pour le moment. Soyez le premier !</div>
                            )}
                        </div>
                        <Link href="/idees" className="btn-primary btn-block text-center" style={{ textDecoration: 'none', display: 'block' }}>
                            Accéder au Forum
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IdeaSection;
