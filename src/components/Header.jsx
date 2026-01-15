"use client";

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (!menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <div className="logo">
                    <span className="logo-text">Lexence.</span>
                </div>

                {/* Desktop Nav */}
                <nav className="nav desktop-nav">
                    <a href="#why" className="nav-link">
                        Pourquoi Lexence ?
                    </a>
                    <a href="#features" className="nav-link">Fonctionnalités</a>
                    <a href="#ideas" className="nav-link">Idées</a>
                    <ThemeToggle />
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="btn-primary">Se connecter</button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="btn-secondary">S'inscrire</button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </nav>

                {/* Mobile Menu Toggle */}
                <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Menu">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                {/* Mobile Nav Overlay */}
                <div className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
                    <div className="mobile-nav-content">
                        <a href="#why" className="mobile-link" onClick={toggleMenu}>Pourquoi Lexence ?</a>
                        <a href="#features" className="mobile-link" onClick={toggleMenu}>Fonctionnalités</a>
                        <a href="#ideas" className="mobile-link" onClick={toggleMenu}>Idées</a>
                        <div className="mobile-auth">
                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                                <ThemeToggle />
                            </div>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="btn-primary full-width" onClick={toggleMenu}>Se connecter</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="btn-secondary full-width" onClick={toggleMenu}>S'inscrire</button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <div className="mobile-user-profile">
                                    <UserButton afterSignOutUrl="/" />
                                    <span className="user-label">Mon Profil</span>
                                </div>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
