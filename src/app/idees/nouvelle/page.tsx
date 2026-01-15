'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../ideas.css';

interface Category {
    id: number;
    name: string;
    description: string;
    color: string;
}

export default function NewIdeaPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/idees');
        }
        fetchCategories();
    }, [isLoaded, user]);

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        let data = await res.json();

        // Filter for UI
        const emailAddresses = user?.emailAddresses?.map(e => e.emailAddress.toLowerCase()) || [];
        const isAdmin = emailAddresses.some(email => email === 'zapchoc92@gmail.com'.toLowerCase());

        const filtered = data.filter((cat: any) => {
            if (cat.name === 'Annonces' || cat.name === 'Règles') {
                return isAdmin;
            }
            return true;
        });

        setCategories(filtered);
        if (filtered.length > 0) setCategoryId(filtered[0].id.toString());
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('categoryId', categoryId);
            if (image) {
                formData.append('image', image);
            }

            const res = await fetch('/api/ideas', {
                method: 'POST',
                body: formData, // No Content-Type header needed, browser sets it for FormData
            });

            if (res.ok) {
                router.push('/idees');
            } else {
                const data = await res.json();
                alert(data.error || 'Erreur lors de la création');
            }
        } catch (error) {
            console.error('Error submitting idea:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isLoaded || !user) return <p>Chargement...</p>;

    return (
        <div className="ideas-container">
            <header className="ideas-header">
                <div>
                    <h1>Nouvelle Suggestion</h1>
                    <p>Partagez votre idée avec la communauté.</p>
                </div>
                <Link href="/idees" className="btn-secondary">Retour</Link>
            </header>

            <form onSubmit={handleSubmit} className="new-idea-form" style={{ background: 'var(--color-bg-secondary)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid rgba(197, 168, 124, 0.05)' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="De quoi s'agit-il ?"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(197, 168, 124, 0.2)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Catégorie</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(197, 168, 124, 0.2)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={6}
                        placeholder="Détaillez votre proposition..."
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(197, 168, 124, 0.2)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', resize: 'vertical' }}
                    ></textarea>
                </div>

                <div className="file-upload-wrapper" style={{ marginBottom: '20px' }}>
                    <label className="file-upload-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 15px', border: '1px dashed rgba(197, 168, 124, 0.3)', borderRadius: '8px', background: 'var(--color-bg)' }}>
                        <span>📎 Joindre une capture d'écran</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                    {previewUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={previewUrl} alt="Aperçu" className="image-preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #eee' }} />
                            <button
                                type="button"
                                onClick={() => { setImage(null); setPreviewUrl(null); }}
                                style={{ display: 'block', marginTop: '5px', background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Supprimer l'image
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-new-topic"
                    style={{ width: '100%' }}
                >
                    {submitting ? 'Envoi en cours...' : 'Publier la suggestion'}
                </button>
            </form>
        </div>
    );
}
