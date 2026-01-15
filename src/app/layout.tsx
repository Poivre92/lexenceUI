import type { Metadata } from "next";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import "../index.css";

import { Manrope, Playfair_Display } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Lexence - L'élégance du mot juste",
        template: "%s | Lexence"
    },
    description: "Enrichissez votre esprit, mot après mot. Une expérience d'apprentissage immersive dédiée au vocabulaire français rare et littéraire.",
    keywords: ["vocabulaire", "français", "apprentissage", "littérature", "éloquence", "mots rares", "leitner"],
    authors: [{ name: "Lexence Team" }],
    creator: "Lexence",
    publisher: "Lexence",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: "Lexence - L'élégance du mot juste",
        description: "Enrichissez votre esprit, mot après mot. Une expérience d'apprentissage immersive dédiée au vocabulaire français rare et littéraire.",
        url: "https://lexence.app",
        siteName: "Lexence",
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "/images/og-lexence.png",
                width: 1200,
                height: 630,
                alt: "Lexence - L'élégance du mot juste",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lexence - L'élégance du mot juste",
        description: "Enrichissez votre esprit, mot après mot. Une expérience d'apprentissage immersive dédiée au vocabulaire français rare et littéraire.",
        images: ["/images/og-lexence.png"],
    },
    manifest: "/manifest.json",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
        { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
    ],
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

import PageTransition from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: '#6A7B9C',
                }
            }}
        >
            <html lang="fr" suppressHydrationWarning className={`${manrope.variable} ${playfair.variable}`}>
                <body suppressHydrationWarning>
                    <PageTransition>
                        {children}
                    </PageTransition>
                    <Analytics />
                </body>
            </html>
        </ClerkProvider>
    );
}
