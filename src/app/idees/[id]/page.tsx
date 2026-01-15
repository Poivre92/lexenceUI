'use client';

import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../ideas.css';

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

interface Comment {
    id: number;
    idea_id: number;
    author: string;
    content: string;
    created_at: string;
}

export default function IdeaDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    if (!id) return <div className="ideas-container"><p>URL invalide</p></div>;
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [idea, setIdea] = useState<Idea | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [voted, setVoted] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const isAdmin = isLoaded && user?.emailAddresses.some(e => e.emailAddress.toLowerCase() === 'zapchoc92@gmail.com'.toLowerCase());

    useEffect(() => {
        if (!isDeleting) {
            fetchIdea();
            fetchComments();
        }
    }, [id, isDeleting]);

    const fetchIdea = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`/api/ideas/${id}`);
            const data = await res.json();
            if (res.ok) {
                setIdea(data);
            }
        } catch (error) {
            console.error('Error fetching idea:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/ideas/${id}/comments`);
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleVote = async () => {
        if (!user) return;

        // Optimistic update
        if (idea) {
            setIdea({ ...idea, vote_count: Number(idea.vote_count) + 1 });
        }
        setVoted(true);
        setTimeout(() => setVoted(false), 600);

        try {
            const res = await fetch(`/api/ideas/${id}/vote`, { method: 'POST' });
            if (res.ok) {
                fetchIdea(true); // Silent background sync
            } else {
                fetchIdea(true); // Revert/Sync on error
            }
        } catch (error) {
            console.error('Error voting:', error);
            fetchIdea(true);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        setIsDeleting(true);
        setShowConfirm(false); // Hide confirm buttons while deleting
        try {
            const url = `/api/ideas/${id}`;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (res.ok) {
                alert('Suggestion supprimée avec succès');
                router.push('/idees');
            } else {
                const text = await res.text();
                alert(`Erreur (${res.status}): ${text}`);
                setIsDeleting(false);
            }
        } catch (error: any) {
            alert('Erreur réseau : ' + error.message);
            setIsDeleting(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;
        try {
            const res = await fetch(`/api/ideas/${id}/comments?commentId=${commentId}`, { method: 'DELETE' });
            if (res.ok) {
                alert('Commentaire supprimé');
                fetchComments();
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Erreur réseau');
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmittingComment(true);

        try {
            const res = await fetch(`/api/ideas/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return <div className="ideas-container"><p>Chargement...</p></div>;
    if (!idea) return <div className="ideas-container"><p>Suggestion non trouvée.</p></div>;

    return (
        <div className="ideas-container">
            <header className="ideas-header">
                <div>
                    <Link href="/idees" style={{ textDecoration: 'none', color: 'var(--color-text-secondary)', marginBottom: '10px', display: 'block' }}>← Retour au forum</Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h1>{idea.title}</h1>
                        {isAdmin && (
                            <div style={{ background: '#4CAF50', color: 'white', padding: '5px 12px', borderRadius: '44px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ fontSize: '1.1rem' }}>🛡️</span> Admin
                            </div>
                        )}
                        {isAdmin && !showConfirm && (
                            <button
                                onClick={handleDelete}
                                style={{ background: 'var(--color-bg)', border: '1px solid #ff4d4d', color: '#ff4d4d', cursor: 'pointer', fontSize: '1rem', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, transition: 'all 0.2s' }}
                                title="Supprimer la suggestion"
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                            >
                                🗑️ Supprimer
                            </button>
                        )}
                        {isAdmin && showConfirm && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={handleDelete}
                                    style={{ background: '#ff4d4d', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem', padding: '6px 15px', borderRadius: '6px', fontWeight: 700 }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? '...' : 'Valider la suppression ?'}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    style={{ background: 'var(--color-bg-secondary)', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '0.9rem', padding: '6px 15px', borderRadius: '6px' }}
                                    disabled={isDeleting}
                                >
                                    Annuler
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="idea-meta">
                        <span
                            className="idea-category-tag"
                            style={{ backgroundColor: idea.category_color }}
                        >
                            {idea.category_name}
                        </span>
                        <span>Par {idea.author}</span>
                        <span>{new Date(idea.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                </div>
                {!(idea.category_name === 'Annonces' || idea.category_name === 'Règles') && (
                    <>
                        {user ? (
                            <div
                                className={`vote-badge ${voted ? 'voted' : ''}`}
                                onClick={handleVote}
                                style={{
                                    cursor: 'pointer',
                                    border: '1px solid rgba(197, 168, 124, 0.1)',
                                    background: 'var(--color-bg-secondary)',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <span className="count" style={{ fontSize: '1.4rem' }}>{idea.vote_count}</span>
                                <span className="label" style={{ fontWeight: 600 }}>Voter +</span>
                            </div>
                        ) : (
                            <SignInButton mode="modal">
                                <div
                                    className="vote-badge"
                                    style={{
                                        cursor: 'pointer',
                                        border: '1px solid rgba(197, 168, 124, 0.1)',
                                        background: 'var(--color-bg-secondary)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="count" style={{ fontSize: '1.4rem' }}>{idea.vote_count}</span>
                                    <span className="label" style={{ fontWeight: 600 }}>Connectez-vous</span>
                                </div>
                            </SignInButton>
                        )}
                    </>
                )}
            </header>

            <div className="idea-content" style={{ background: 'var(--color-bg-secondary)', padding: '30px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid rgba(197, 168, 124, 0.05)' }}>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: '1.6' }}>{idea.description}</p>
                {idea.image_url && (
                    <div style={{ marginTop: '25px' }}>
                        <div
                            className="file-attachment-card"
                            onClick={() => setLightboxOpen(true)}
                        >
                            <div className="file-attachment-preview">
                                <img src={idea.image_url} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="file-attachment-info">
                                <span className="file-name">Capture d'écran jointe</span>
                                <span className="file-action">Cliquez pour agrandir</span>
                            </div>
                        </div>

                        {lightboxOpen && (
                            <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
                                <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="lightbox-close"
                                        onClick={() => setLightboxOpen(false)}
                                    >
                                        ×
                                    </button>
                                    <img
                                        src={idea.image_url}
                                        alt="Pleine taille"
                                        className="lightbox-image"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <section className="comments-section">
                <h3>Commentaires ({comments.length})</h3>

                {user ? (
                    <form onSubmit={handleSubmitComment} style={{ marginBottom: '30px' }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Écrire un commentaire..."
                            rows={3}
                            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(197, 168, 124, 0.2)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', marginBottom: '10px' }}
                        ></textarea>
                        <button type="submit" disabled={submittingComment} className="btn-new-topic">
                            Publier
                        </button>
                    </form>
                ) : (
                    <div style={{ marginBottom: '30px', color: 'var(--color-text-secondary)' }}>
                        <SignInButton mode="modal">
                            <span style={{ color: '#0070f3', cursor: 'pointer' }}>Connectez-vous</span>
                        </SignInButton> pour commenter.
                    </div>
                )}

                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} style={{ padding: '15px', borderBottom: '1px solid rgba(197, 168, 124, 0.1)', position: 'relative' }}>
                            <div style={{ fontWeight: '600', marginBottom: '5px' }}>{comment.author}</div>
                            <p style={{ margin: 0 }}>{comment.content}</p>
                            <small style={{ color: 'var(--color-text-secondary)', opacity: 0.8 }}>{new Date(comment.created_at).toLocaleString('fr-FR')}</small>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#ff4d4d',
                                        cursor: 'pointer',
                                        fontSize: '1.11rem'
                                    }}
                                    title="Supprimer le commentaire"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
