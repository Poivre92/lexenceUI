'use client';

import React from 'react';
import Link from 'next/link';

export default function Confidentialite() {
    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
            <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Retour à l'accueil
            </Link>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
                Politique de Confidentialité
            </h1>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    1. Introduction
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    La protection de vos données personnelles est une priorité pour Lexence. Cette politique de confidentialité détaille les informations que nous collectons, comment nous les utilisons et vos droits conformément au Règlement Général sur la Protection des Données (RGPD).
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    2. Données collectées
                </h2>
                <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    <p>Nous collectons les catégories de données suivantes :</p>
                    <ul style={{ marginTop: '1rem' }}>
                        <li><strong>Authentification :</strong> Nous utilisons <strong>Clerk</strong> pour la gestion des comptes. Lors de votre connexion, nous recevons votre adresse e-mail, votre nom et votre photo de profil le cas échéant.</li>
                        <li><strong>Contenu généré par l'utilisateur :</strong> Les idées, suggestions, votes et commentaires que vous publiez sur notre plateforme communautaire sont stockés dans notre base de données.</li>
                        <li><strong>Données techniques :</strong> Nous pouvons collecter des informations sur votre appareil et votre navigation pour assurer la sécurité et le bon fonctionnement du site.</li>
                    </ul>
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    3. Utilisation et Finalités
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Vos données sont traitées pour les finalités suivantes :
                </p>
                <ul style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
                    <li>Fourniture et gestion de votre compte utilisateur.</li>
                    <li>Publication de vos contributions sur le forum Lexence.</li>
                    <li>Amélioration de notre algorithme d'apprentissage et de nos contenus linguistiques.</li>
                    <li>Communication concernant les mises à jour de l'application (uniquement si consenti).</li>
                </ul>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    4. Destinataires et Sécurité
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Vos données ne sont jamais vendues à des tiers. Elles sont uniquement accessibles aux services nécessaires au fonctionnement du site (Clerk pour l'auth, hébergement). Nous appliquons des protocoles de sécurité stricts pour prévenir toute fuite ou accès non autorisé.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    5. Durée de conservation
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Les données de compte sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données personnelles identifiables sont supprimées dans un délai de 30 jours, à l'exception des contenus publics qui peuvent être anonymisés.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    6. Vos Droits
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données personnelles. Vous pouvez exercer ces droits à tout moment :
                </p>
                <ul style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginTop: '1rem' }}>
                    <li>Via les paramètres de votre compte (fournis par Clerk).</li>
                    <li>En nous écrivant à : <strong>lexenceappdev@gmail.com</strong></li>
                </ul>
            </section>
        </div>
    );
}
