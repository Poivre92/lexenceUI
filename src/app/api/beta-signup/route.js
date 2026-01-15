
import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

export async function POST(request) {
    try {
        // Ensure database schema is up to date (creates table if missing)
        await initDb();

        const { email, honey } = await request.json();

        // 1. Honeypot check: If honey field is filled, it's a bot.
        if (honey) {
            // Return success to fool the bot, but do nothing.
            return NextResponse.json({ success: true, message: 'Inscription validée.' });
        }

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Adresse email invalide.' },
                { status: 400 }
            );
        }

        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        const client = await pool.connect();
        try {
            // 2. Global Rate Limit: Prevent massive floods (max 5 per minute globally)
            // This is an "Emergency Brake".
            const globalRateCheck = await client.query(
                `SELECT count(*) FROM beta_signups WHERE created_at > NOW() - INTERVAL '1 minute'`
            );

            if (parseInt(globalRateCheck.rows[0].count) > 10) {
                // Too many requests globally. Silently fail or return error.
                // Let's return error to be safe.
                return NextResponse.json(
                    { error: 'Serveur surchargé. Veuillez réessayer dans une minute.' },
                    { status: 429 }
                );
            }

            // 3. User Rate Limit (IP check)
            if (ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
                const ipCheck = await client.query('SELECT 1 FROM beta_signups WHERE ip_address = $1 LIMIT 1', [ip]);
                if (ipCheck.rowCount > 0) {
                    return NextResponse.json(
                        { error: 'Une inscription a déjà été effectuée depuis cette connexion.' },
                        { status: 429 }
                    );
                }
            }

            // Insert email with IP tracking
            await client.query(
                'INSERT INTO beta_signups (email, ip_address) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
                [email, ip]
            );

            try {
                // Send notification to admin (fire and forget to not block response too long, 
                // but await is safer here to ensure it's triggered)
                const { sendNotification } = await import('@/lib/mail');
                await sendNotification(
                    'Nouvelle inscription Beta',
                    `Un nouvel utilisateur s'est inscrit à la beta : ${email}`
                );
            } catch (mailError) {
                console.error('Failed to send beta notification', mailError);
                // Don't fail the request if email fails, database insert is what matters
            }

            return NextResponse.json({ success: true, message: 'Inscription validée.' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Beta signup error:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue.' },
            { status: 500 }
        );
    }
}
