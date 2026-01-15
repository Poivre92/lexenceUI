import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

const ADMIN_EMAIL = 'zapchoc92@gmail.com';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { rows } = await pool.query(`
            SELECT 
                ideas.*,
                categories.name as category_name,
                categories.color as category_color,
                COUNT(votes.id) as vote_count
            FROM ideas
            LEFT JOIN categories ON ideas.category_id = categories.id
            LEFT JOIN votes ON ideas.id = votes.idea_id
            WHERE ideas.id = $1
            GROUP BY ideas.id, categories.id
        `, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Suggestion non trouvée' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const logPath = path.join(process.cwd(), 'admin_debug.log');
    const timestamp = new Date().toISOString();

    try {
        fs.appendFileSync(logPath, `[${timestamp}] DELETE START\n`);
        const resolvedParams = await params;
        const id = resolvedParams.id;
        fs.appendFileSync(logPath, `[${timestamp}] ID: ${id}\n`);

        console.log(`[DEBUG] Method: DELETE, ID: ${id}`);

        fs.appendFileSync(logPath, `[${timestamp}] Fetching User...\n`);
        const user = await currentUser();
        const emailList = user?.emailAddresses?.map(e => e.emailAddress) || [];
        fs.appendFileSync(logPath, `[${timestamp}] Emails: ${JSON.stringify(emailList)}\n`);

        const isAdmin = emailList.some(email => email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
        fs.appendFileSync(logPath, `[${timestamp}] isAdmin: ${isAdmin}\n`);

        if (!isAdmin) {
            fs.appendFileSync(logPath, `[${timestamp}] 403 Forbidden\n`);
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        fs.appendFileSync(logPath, `[${timestamp}] Deleting associated votes and comments...\n`);
        await pool.query('DELETE FROM votes WHERE idea_id = $1', [id]);
        await pool.query('DELETE FROM comments WHERE idea_id = $1', [id]);

        fs.appendFileSync(logPath, `[${timestamp}] Deleting idea from DB...\n`);
        const result = await pool.query('DELETE FROM ideas WHERE id = $1', [id]);
        fs.appendFileSync(logPath, `[${timestamp}] Deleted rows: ${result.rowCount}\n`);

        return NextResponse.json({ message: 'Supprimé avec succès' });
    } catch (error) {
        const errorMsg = `[${timestamp}] ERROR: ${error.message}\n${error.stack}\n`;
        fs.appendFileSync(logPath, errorMsg);
        console.error('[CRITICAL]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
