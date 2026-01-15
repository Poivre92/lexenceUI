import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

const ADMIN_EMAIL = 'zapchoc92@gmail.com';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { rows } = await pool.query(
            'SELECT * FROM comments WHERE idea_id = $1 ORDER BY created_at DESC',
            [id]
        );
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: 'Connectez-vous pour commenter' }, { status: 401 });
        }

        const { content } = await request.json();
        if (!content) {
            return NextResponse.json({ error: 'Le contenu est requis' }, { status: 400 });
        }

        const author = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || 'Utilisateur';
        const email = user.emailAddresses[0]?.emailAddress;

        const result = await pool.query(`
            INSERT INTO comments (idea_id, author, author_email, content)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [id, author, email, content]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const logPath = path.join(process.cwd(), 'admin_debug.log');
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logPath, `[${timestamp}] COMMENT DELETE START\n`);
        const user = await currentUser();
        const emailList = user?.emailAddresses?.map(e => e.emailAddress) || [];
        fs.appendFileSync(logPath, `[${timestamp}] COMMENT emails: ${JSON.stringify(emailList)}\n`);

        const isAdmin = emailList.some(email => email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
        fs.appendFileSync(logPath, `[${timestamp}] COMMENT isAdmin: ${isAdmin}\n`);

        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('commentId');
        fs.appendFileSync(logPath, `[${timestamp}] COMMENT ID: ${commentId}\n`);

        if (!isAdmin) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        if (!commentId) {
            return NextResponse.json({ error: 'Comment ID requis' }, { status: 400 });
        }

        await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
        fs.appendFileSync(logPath, `[${timestamp}] COMMENT deleted\n`);
        return NextResponse.json({ message: 'Commentaire supprimé' });
    } catch (error) {
        const errorMsg = `[${timestamp}] COMMENT ERROR: ${error.message}\n${error.stack}\n`;
        fs.appendFileSync(logPath, errorMsg);
        console.error('[CRITICAL] DELETE Comment error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
