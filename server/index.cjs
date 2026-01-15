const express = require('express');
const cors = require('cors');
const db = require('./database.cjs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all ideas with vote counts
app.get('/api/ideas', (req, res) => {
    const { categoryId, search, sort } = req.query;

    let query = `
    SELECT 
      ideas.*,
      categories.name as category_name,
      categories.color as category_color,
      COUNT(votes.id) as vote_count,
      (SELECT COUNT(*) FROM comments WHERE comments.idea_id = ideas.id) as comment_count
    FROM ideas
    LEFT JOIN categories ON ideas.category_id = categories.id
    LEFT JOIN votes ON ideas.id = votes.idea_id
  `;

    const conditions = [];
    const params = [];

    if (categoryId && categoryId !== 'all') {
        conditions.push('ideas.category_id = ?');
        params.push(categoryId);
    }

    if (search) {
        conditions.push('(ideas.title LIKE ? OR ideas.description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY ideas.id';

    // Sorting
    if (sort === 'recent') {
        query += ' ORDER BY ideas.created_at DESC';
    } else {
        query += ' ORDER BY vote_count DESC'; // Default: trending
    }

    try {
        const ideas = db.prepare(query).all(...params);
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single idea
app.get('/api/ideas/:id', (req, res) => {
    const query = `
    SELECT 
      ideas.*,
      COUNT(votes.id) as vote_count,
      (SELECT COUNT(*) FROM comments WHERE comments.idea_id = ideas.id) as comment_count
    FROM ideas
    LEFT JOIN votes ON ideas.id = votes.idea_id
    WHERE ideas.id = ?
    GROUP BY ideas.id
  `;

    try {
        const idea = db.prepare(query).get(req.params.id);
        if (idea) {
            res.json(idea);
        } else {
            res.status(404).json({ error: 'Idea not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new idea
app.post('/api/ideas', (req, res) => {
    const { title, description, author, category_id, author_email } = req.body;

    if (!title || !description || !author) {
        return res.status(400).json({ error: 'Title, description, and author are required' });
    }

    try {
        const result = db.prepare(`
      INSERT INTO ideas (title, description, author, category_id, author_email) VALUES (?, ?, ?, ?, ?)
    `).run(title, description, author, category_id || null, author_email || null);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Idea created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vote on an idea
app.post('/api/ideas/:id/vote', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Check if already voted
        const existingVote = db.prepare('SELECT * FROM votes WHERE idea_id = ? AND user_id = ?')
            .get(req.params.id, user_id);

        if (existingVote) {
            // Remove vote (toggle)
            db.prepare('DELETE FROM votes WHERE idea_id = ? AND user_id = ?')
                .run(req.params.id, user_id);
            res.json({ message: 'Vote removed', voted: false });
        } else {
            // Add vote
            db.prepare('INSERT INTO votes (idea_id, user_id) VALUES (?, ?)')
                .run(req.params.id, user_id);
            res.json({ message: 'Vote added', voted: true });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if user has voted
app.get('/api/ideas/:id/vote/:userId', (req, res) => {
    try {
        const vote = db.prepare('SELECT * FROM votes WHERE idea_id = ? AND user_id = ?')
            .get(req.params.id, req.params.userId);
        res.json({ voted: !!vote });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get comments for an idea
app.get('/api/ideas/:id/comments', (req, res) => {
    try {
        const comments = db.prepare(`
      SELECT * FROM comments WHERE idea_id = ? ORDER BY created_at DESC
    `).all(req.params.id);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a comment
app.post('/api/ideas/:id/comments', (req, res) => {
    const { author, content } = req.body;

    if (!author || !content) {
        return res.status(400).json({ error: 'Author and content are required' });
    }

    try {
        const result = db.prepare(`
      INSERT INTO comments (idea_id, author, content) VALUES (?, ?, ?)
    `).run(req.params.id, author, content);

        res.status(201).json({ id: result.lastInsertRowid, message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CATEGORIES API

// Get categories
app.get('/api/categories', (req, res) => {
    try {
        const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create category
app.post('/api/categories', (req, res) => {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const result = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)').run(name, color || '#7b1fa2');
        res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update manual order or other fields
app.patch('/api/categories', (req, res) => {
    const { categories } = req.body;
    if (!Array.isArray(categories)) return res.status(400).json({ error: 'Invalid data' });

    try {
        const update = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
        const transaction = db.transaction((cats) => {
            for (const cat of cats) {
                update.run(cat.sort_order, cat.id);
            }
        });
        transaction(categories);
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete idea
app.delete('/api/ideas/:id', (req, res) => {
    try {
        db.prepare('DELETE FROM ideas WHERE id = ?').run(req.params.id);
        res.json({ message: 'Idea deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Lexence API running at http://localhost:${PORT}`);
});
