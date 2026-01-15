import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import fs from 'fs';
import path from 'path';

const ADMIN_EMAIL = 'zapchoc92@gmail.com';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
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
        const { id } = await params;
        fs.appendFileSync(logPath, `[${timestamp}] CAT DELETE START ID: ${id}\n`);

        const user = await currentUser();
        const emailList = user?.emailAddresses?.map(e => e.emailAddress) || [];
        fs.appendFileSync(logPath, `[${timestamp}] User emails: ${JSON.stringify(emailList)}\n`);

        const isAdmin = emailList.some(e => e.toLowerCase() === ADMIN_EMAIL.toLowerCase());
        fs.appendFileSync(logPath, `[${timestamp}] isAdmin: ${isAdmin}\n`);

        if (!isAdmin) {
            fs.appendFileSync(logPath, `[${timestamp}] 403 Forbidden\n`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Prevent deleting core categories
        const coreIds = [10, 11, 12];
        if (coreIds.includes(parseInt(id))) {
            fs.appendFileSync(logPath, `[${timestamp}] 400 Core Category\n`);
            return NextResponse.json({ error: 'Cannot delete core categories' }, { status: 400 });
        }

        // Reassign ideas to a fallback category before deleting
        const fallbackRes = await pool.query('SELECT id FROM categories WHERE id != $1 ORDER BY id ASC LIMIT 1', [id]);

        if (fallbackRes.rows.length > 0) {
            const fallbackId = fallbackRes.rows[0].id;
            fs.appendFileSync(logPath, `[${timestamp}] Reassigning ideas to ${fallbackId}\n`);
            await pool.query('UPDATE ideas SET category_id = $1 WHERE category_id = $2', [fallbackId, id]);
        } else {
            fs.appendFileSync(logPath, `[${timestamp}] No fallback category. Deleting ideas in category ${id}\n`);
            await pool.query('DELETE FROM ideas WHERE category_id = $1', [id]);
        }

        fs.appendFileSync(logPath, `[${timestamp}] Deleting category ${id}\n`);
        await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        fs.appendFileSync(logPath, `[${timestamp}] SUCCESS\n`);
        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        fs.appendFileSync(logPath, `[${timestamp}] ERROR: ${error.message}\n`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
