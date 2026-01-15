'use client';

import React from 'react';
import Link from 'next/link';

export default function MentionsLegales() {
    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
            <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Retour à l'accueil
            </Link>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
                Mentions Légales
            </h1>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    1. Édition du site
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site internet <strong>https://lexence.app</strong> l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :
                </p>
                <ul style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
                    <li><strong>Propriétaire du site :</strong> Rémi Sanchez</li>
                    <li><strong>Contact :</strong> lexenceappdev@gmail.com</li>
                    <li><strong>Directeur de la publication :</strong> Rémi Sanchez</li>
                </ul>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    2. Hébergement
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Le Site est hébergé par la société <strong>InfinityFree (Epik Inc.)</strong>.<br />
                    Adresse : 3110 5th Ave NE, Suite 100, Seattle, WA 98105, USA.<br />
                    Site web : <a href="https://www.infinityfree.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>www.infinityfree.com</a>
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    3. Propriété intellectuelle et contrefaçons
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Rémi Sanchez est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site internet, notamment les textes, images, graphismes, logos, vidéos, architecture, icônes et sons.
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
                    Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                </p>
            </section>

            <section style={{ marginBottom: '3rem', padding: '1.5rem', border: '1px solid rgba(197, 168, 124, 0.2)', borderRadius: '12px', background: 'var(--color-bg-secondary)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    4. Crédits et Sources de données
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    L'application Lexence utilise des données linguistiques extraites de la base de données du <strong>Wiktionnaire</strong> (le dictionnaire libre et universel).
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
                    Ces contenus sont mis à disposition sous licence <strong>Creative Commons Attribution-Partage dans les Mêmes Conditions 3.0 (CC BY-SA 3.0)</strong> et <strong>GNU Free Documentation License (GFDL)</strong>. Les contributeurs du Wiktionnaire restent les auteurs originaux de ces contenus.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    5. Limitations de responsabilité
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Rémi Sanchez ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site https://lexence.app.
                </p>
            </section>
        </div>
    );
}
