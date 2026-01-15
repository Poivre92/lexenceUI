'use client';

import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import './ideas.css';
import SkeletonIdea from '../../components/SkeletonIdea';

interface Category {
    id: number;
    name: string;
    description: string;
    color: string;
}

interface Idea {
    id: number;
    title: string;
    description: string;
    author: string;
    author_email: string;
    status: string;
    category_id: number;
    category_name: string;
    category_color: string;
    vote_count: string | number;
    created_at: string;
    image_url?: string;
}

export default function IdeasPage() {
    const { user, isLoaded } = useUser();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [votedId, setVotedId] = useState<number | null>(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const isAdmin = isLoaded && user?.emailAddresses.some(e => e.emailAddress.toLowerCase() === 'zapchoc92@gmail.com'.toLowerCase());

    useEffect(() => {
        fetchCategories();
    }, []); // Fetch categories only once on mount

    useEffect(() => {
        fetchIdeas(false); // Show loading when changing category
    }, [activeCategory]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleReorder = async (id: number, direction: 'up' | 'down') => {
        const index = categories.findIndex(c => c.id === id);
        if (index === -1) return;

        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= categories.length) return;

        const [moved] = newCategories.splice(index, 1);
        newCategories.splice(targetIndex, 0, moved);

        const updated = newCategories.map((c, i) => ({ id: c.id, sort_order: i }));
        setCategories(newCategories);

        try {
            const res = await fetch('/api/categories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: updated })
            });
            if (!res.ok) throw new Error('Update failed');
        } catch (error) {
            console.error('Error reordering:', error);
            alert('Échec de la réorganisation');
            fetchCategories();
        }
    };

    const fetchIdeas = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`/api/ideas${activeCategory !== 'all' ? `?categoryId=${activeCategory}` : ''}`);
            const data = await res.json();
            setIdeas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching ideas:', error);
        } finally {
            if (!silent) {
                // Smoothing the transition
                setTimeout(() => setLoading(false), 600);
            }
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const url = `/api/ideas/${id}`;
            const res = await fetch(url, { method: 'DELETE' });

            if (res.ok) {
                setIdeas(prev => prev.filter(i => i.id !== id));
            } else {
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    alert(`Erreur : ${json.error || text}`);
                } catch {
                    alert(`Erreur (${res.status}) : ${text}`);
                }
            }
        } catch (error: any) {
            alert('Erreur réseau : ' + error.message);
        }
    };

    const handleVote = async (id: number, e: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!user) {
            alert('Veuillez vous connecter pour voter.');
            return;
        }

        // Optimistic update: Immediate feedback without flicker
        setIdeas(prev => prev.map(idea =>
            idea.id === id
                ? { ...idea, vote_count: Number(idea.vote_count) + 1 }
                : idea
        ));
        setVotedId(id);
        setTimeout(() => setVotedId(null), 1000);

        try {
            const res = await fetch(`/api/ideas/${id}/vote`, { method: 'POST' });
            if (res.ok) {
                // Background sync without loading message
                fetchIdeas(true);
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors du vote');
                // Revert on error
                fetchIdeas(true);
            }
        } catch (error) {
            console.error('Error voting:', error);
            fetchIdeas(true);
        }
    };

    return (
        <div className="ideas-container">
            <header className="ideas-header">
                <div>
                    <h1>Proposez des suggestions et aidez-nous à améliorer Lexence.</h1>
                    <p>Partagez vos idées pour rendre notre application encore plus performante.</p>
                    {isAdmin && (
                        <div style={{ background: '#4CAF50', color: 'white', padding: '5px 12px', borderRadius: '44px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content' }}>
                            <span style={{ fontSize: '1.1rem' }}>🛡️</span> Administrateur
                        </div>
                    )}
                </div>
                {user ? (
                    <Link href="/idees/nouvelle" className="btn-new-topic" style={{ textDecoration: 'none' }}>
                        Nouvelle Suggestion
                    </Link>
                ) : (
                    <SignInButton mode="modal">
                        <button className="btn-new-topic">Se connecter pour proposer</button>
                    </SignInButton>
                )}
            </header>

            <div className="forum-layout">
                <aside className="sidebar-categories">
                    <div
                        className={`category-item ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        <div className="category-color" style={{ backgroundColor: '#ccc' }}></div>
                        Toutes les idées
                    </div>
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            className={`category-item ${activeCategory === cat.id.toString() ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id.toString())}
                            style={{ position: 'relative' }}
                        >
                            <span className="category-name">
                                {cat.name}
                            </span>
                            {isAdmin && (
                                <div className="admin-cat-actions">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReorder(cat.id, 'up'); }}
                                        className="reorder-btn"
                                        title="Monter"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReorder(cat.id, 'down'); }}
                                        className="reorder-btn"
                                        title="Descendre"
                                    >
                                        ↓
                                    </button>
                                    {![10, 11, 12].includes(cat.id) && !['Annonces', 'Règles'].includes(cat.name) && (
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' });
                                                    if (res.ok) {
                                                        fetchCategories();
                                                        window.location.reload();
                                                    } else {
                                                        const err = await res.json();
                                                        alert(err.error || 'Erreur lors de la suppression');
                                                    }
                                                } catch (error) {
                                                    alert('Erreur réseau');
                                                }
                                            }}
                                            className="delete-cat-btn"
                                            title="Supprimer cette catégorie"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isAdmin && (
                        <div style={{ marginTop: '10px' }}>
                            {isAddingCategory ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Nom de la catégorie..."
                                        autoFocus
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: '1px solid #ccc',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
                                        onKeyDown={async (e) => {
                                            if (e.key === 'Enter') {
                                                if (newCategoryName.trim()) {
                                                    const res = await fetch('/api/categories', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ name: newCategoryName.trim() })
                                                    });
                                                    if (res.ok) {
                                                        alert('Catégorie ajoutée');
                                                        setNewCategoryName('');
                                                        setIsAddingCategory(false);
                                                        fetchCategories();
                                                    } else {
                                                        const err = await res.json();
                                                        alert(err.error || 'Erreur');
                                                    }
                                                }
                                            } else if (e.key === 'Escape') {
                                                setIsAddingCategory(false);
                                            }
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            onClick={async () => {
                                                if (newCategoryName.trim()) {
                                                    const res = await fetch('/api/categories', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ name: newCategoryName.trim() })
                                                    });
                                                    if (res.ok) {
                                                        alert('Catégorie ajoutée');
                                                        setNewCategoryName('');
                                                        setIsAddingCategory(false);
                                                        fetchCategories();
                                                    } else {
                                                        const err = await res.json();
                                                        alert(err.error || 'Erreur');
                                                    }
                                                }
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '5px',
                                                background: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Ajouter
                                        </button>
                                        <button
                                            onClick={() => setIsAddingCategory(false)}
                                            style={{
                                                padding: '5px',
                                                background: '#ccc',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="category-item"
                                    style={{ width: '100%', border: '1px dashed #ccc', justifyContent: 'center' }}
                                    onClick={() => setIsAddingCategory(true)}
                                >
                                    + Ajouter une catégorie
                                </button>
                            )}
                        </div>
                    )}
                </aside>

                <main className="ideas-list">
                    {loading ? (
                        <>
                            <SkeletonIdea type="card" />
                            <SkeletonIdea type="card" />
                            <SkeletonIdea type="card" />
                        </>
                    ) : ideas.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">✨</div>
                            <h3>Inspiration en attente...</h3>
                            <p>Aucune suggestion n'a encore été déposée dans cette catégorie. Soyez le premier à partager votre vision pour Lexence !</p>
                            <Link href="/idees/nouvelle" className="btn-new-topic" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                                Proposer une idée
                            </Link>
                        </div>
                    ) : (
                        ideas.map(idea => (
                            <div key={idea.id} className="idea-card">
                                <Link href={`/idees/${idea.id}`} className="idea-main" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    <div className="idea-title">{idea.title}</div>
                                    <div className="idea-description-preview">{idea.description}</div>
                                    <div className="idea-meta">
                                        <span
                                            className="idea-category-tag"
                                            style={{ backgroundColor: idea.category_color || '#7b1fa2' }}
                                        >
                                            {idea.category_name || 'Général'}
                                        </span>
                                        <span>Par {idea.author}</span>
                                        <span>{new Date(idea.created_at).toLocaleDateString('fr-FR')}</span>
                                        {idea.image_url && (
                                            <span className="idea-has-image-badge" title="Capture d'écran jointe">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                Image
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div className="idea-actions">
                                    {!(idea.category_name === 'Annonces' || idea.category_name === 'Règles') && (
                                        <>
                                            {user ? (
                                                <div
                                                    className={`vote-badge ${votedId === idea.id ? 'voted' : ''}`}
                                                    onClick={(e) => handleVote(idea.id, e)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Voter pour cette idée"
                                                >
                                                    <span className="count">{idea.vote_count || 0}</span>
                                                    <span className="label">Votes</span>
                                                </div>
                                            ) : (
                                                <SignInButton mode="modal">
                                                    <div className="vote-badge" style={{ cursor: 'pointer' }} title="Connectez-vous pour voter">
                                                        <span className="count">{idea.vote_count || 0}</span>
                                                        <span className="label">Voter</span>
                                                    </div>
                                                </SignInButton>
                                            )}
                                        </>
                                    )}
                                    {isAdmin && (
                                        <button
                                            className="btn-delete"
                                            onClick={(e) => handleDelete(idea.id, e)}
                                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                                            title="Supprimer la suggestion"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
