import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

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
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        // Ce log est autorisé sur Vercel
        console.log(`[DEBUG] Tentative de suppression - ID: ${id}`);

        const user = await currentUser();
        const emailList = user?.emailAddresses?.map(e => e.emailAddress) || [];

        const isAdmin = emailList.some(email => email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

        if (!isAdmin) {
            console.log(`[AUTH] Accès refusé pour : ${emailList.join(', ')}`);
            return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
        }

        // Suppression en base de données
        await pool.query('DELETE FROM votes WHERE idea_id = $1', [id]);
        await pool.query('DELETE FROM comments WHERE idea_id = $1', [id]);
        
        const result = await pool.query('DELETE FROM ideas WHERE id = $1', [id]);
        
        console.log(`[SUCCESS] Idée ${id} supprimée. Lignes affectées : ${result.rowCount}`);

        return NextResponse.json({ message: 'Supprimé avec succès' });
    } catch (error) {
        // console.error est également autorisé et recommandé sur Vercel
        console.error('[CRITICAL ERROR]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
