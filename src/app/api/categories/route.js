import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

const ADMIN_EMAIL = 'zapchoc92@gmail.com';

export async function GET() {
    try {
        await initDb();
        const { rows } = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await currentUser();
        const isAdmin = user?.emailAddresses?.some(e => e.emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase());

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { name, description, color } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const result = await pool.query(`
            INSERT INTO categories (name, description, color, sort_order)
            VALUES ($1, $2, $3, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories))
            RETURNING *
        `, [name, description, color || '#7b1fa2']);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const user = await currentUser();
        const isAdmin = user?.emailAddresses?.some(e => e.emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase());

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { categories } = await request.json(); // Array of { id, sort_order }

        for (const cat of categories) {
            await pool.query('UPDATE categories SET sort_order = $1 WHERE id = $2', [cat.sort_order, cat.id]);
        }

        return NextResponse.json({ message: 'Order updated' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
