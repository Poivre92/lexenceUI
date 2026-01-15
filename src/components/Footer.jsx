import Link from 'next/link';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3 className="footer-logo">Lexence.</h3>
                        <p className="footer-tagline">L'élégance des mots au quotidien.</p>
                    </div>
                    <div className="footer-links">
                        <div className="link-group">
                            <h4>Application</h4>
                            <a href="#features">Fonctionnalités</a>
                            <a href="#ideas">Roadmap</a>
                        </div>
                        <div className="link-group">
                            <h4>Légal</h4>
                            <Link href="/mentions-legales">Mentions légales</Link>
                            <Link href="/confidentialite">Confidentialité</Link>
                            <Link href="/cgu">CGU</Link>
                        </div>
                        <div className="link-group">
                            <h4>Contact</h4>
                            <a href="#">Support</a>
                            <a href="#">Presse</a>
                            <a href="#">Twitter</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Lexence. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
