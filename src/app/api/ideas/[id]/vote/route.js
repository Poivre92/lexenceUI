import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { sendNotification } from '@/lib/mail';

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: 'Sign in to vote' }, { status: 401 });
        }

        const userId = user.id;

        // Check if user already voted
        const existingVote = await pool.query(
            'SELECT id FROM votes WHERE idea_id = $1 AND user_id = $2',
            [id, userId]
        );

        if (existingVote.rows.length > 0) {
            // Remove vote (toggle)
            await pool.query(
                'DELETE FROM votes WHERE idea_id = $1 AND user_id = $2',
                [id, userId]
            );
            return NextResponse.json({ message: 'Vote removed' });
        } else {
            // Add vote
            await pool.query(
                'INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)',
                [id, userId]
            );

            // Fetch Idea Title for Notification
            const ideaRes = await pool.query('SELECT title FROM ideas WHERE id = $1', [id]);
            const ideaTitle = ideaRes.rows[0]?.title || 'Idée';

            // Send Notification
            await sendNotification('Nouveau Vote !', `Un utilisateur a voté pour l'idée : "${ideaTitle}".`);

            return NextResponse.json({ message: 'Vote added' });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
