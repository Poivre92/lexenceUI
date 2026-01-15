import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { sendNotification } from '@/lib/mail';

export async function GET(request) {
    try {
        await initDb();
    } catch (e) {
        console.error('Database initialization failed:', e);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const categoryId = searchParams.get('categoryId');

    let query = `
    SELECT 
      ideas.*,
      categories.name as category_name,
      categories.color as category_color,
      COUNT(votes.id) as vote_count
    FROM ideas
    LEFT JOIN categories ON ideas.category_id = categories.id
    LEFT JOIN votes ON ideas.id = votes.idea_id
  `;

    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
        params.push(status);
        conditions.push(`ideas.status = $${params.length}`);
    }

    if (categoryId && categoryId !== 'all') {
        params.push(categoryId);
        conditions.push(`ideas.category_id = $${params.length}`);
    }

    if (search) {
        params.push(`%${search}%`);
        conditions.push(`(ideas.title ILIKE $${params.length} OR ideas.description ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY ideas.id, categories.id';

    if (sort === 'recent') {
        query += ' ORDER BY ideas.created_at DESC';
    } else {
        query += ' ORDER BY vote_count DESC';
    }

    try {
        const { rows } = await pool.query(query, params);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

const ADMIN_EMAIL = 'zapchoc92@gmail.com';

export async function POST(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const categoryId = formData.get('categoryId');
        const file = formData.get('image');

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        // Admin check
        const emailAddresses = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
        const isAdmin = emailAddresses.some(email => email === ADMIN_EMAIL.toLowerCase());

        // Category check
        if (categoryId) {
            const catRes = await pool.query('SELECT name FROM categories WHERE id = $1', [categoryId]);
            if (catRes.rows.length > 0) {
                const catName = catRes.rows[0].name;
                if ((catName === 'Annonces' || catName === 'Règles') && !isAdmin) {
                    return NextResponse.json({ error: "Seul l'administrateur peut poster dans cette catégorie." }, { status: 403 });
                }
            }
        }

        let imageUrl = null;
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create uploads directory if it doesn't exist
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.name) || '.jpg';
            const filename = `idea-${uniqueSuffix}${ext}`;
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        const author = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username || 'Utilisateur';



        const result = await pool.query(`
      INSERT INTO ideas (title, description, author, author_email, category_id, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `, [title, description, author, user.emailAddresses[0].emailAddress, categoryId, imageUrl]);

        // Send email notification
        await sendNotification(
            'Nouvelle Idée !',
            `Une nouvelle idée a été ajoutée par ${author}.\n\nTitre : ${title}\nDescription : ${description}\n\nVoir sur l'app.`
        );

        return NextResponse.json({ id: result.rows[0].id, message: 'Idea created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating idea:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
