'use client';

import React from 'react';
import Link from 'next/link';

export default function CGU() {
    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
            <Link href="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
                ← Retour à l'accueil
            </Link>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
                Conditions Générales d'Utilisation
            </h1>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    1. Acceptation des conditions
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    L'accès et l'utilisation du site Lexence (https://lexence.app) sont soumis à l'acceptation sans réserve des présentes Conditions Générales d'Utilisation (CGU). Lexence se réserve le droit de modifier ces termes à tout moment.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    2. Services proposés
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Lexence propose un service de découverte et d'apprentissage de la langue française, incluant un forum communautaire pour suggérer des idées et interagir avec d'autres utilisateurs. Certains services nécessitent la création d'un compte obligatoire.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    3. Propriété Intellectuelle
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Tous les contenus (textes, logos, design) sont la propriété exclusive de Lexence, à l'exception des données linguistiques issues du <strong>Wiktionnaire</strong> qui sont régies par leurs propres licences (CC BY-SA 3.0 / GFDL). Toute reproduction non autorisée est rigoureusement interdite.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    4. Responsabilité de l'utilisateur
                </h2>
                <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    <p>En utilisant Lexence, vous vous engagez à :</p>
                    <ul style={{ marginTop: '1rem' }}>
                        <li>Ne pas publier de contenus haineux, offensants ou illégaux sur le forum.</li>
                        <li>Respecter les droits de propriété intellectuelle.</li>
                        <li>Ne pas tenter de perturber le bon fonctionnement technique du service.</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>
                        Tout manquement à ces règles pourra entraîner la suspension ou la suppression de votre compte sans préavis.
                    </p>
                </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    5. Limitation de responsabilité
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Lexence s'efforce de fournir des informations exactes mais ne saurait être tenu responsable des erreurs ou omissions dans les définitions linguistiques. Les contenus publiés par les utilisateurs engagent leur seule responsabilité.
                </p>
            </section>

            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    6. Droit applicable
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
                    Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
            </section>
        </div>
    );
}
