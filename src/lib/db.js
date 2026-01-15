import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        color TEXT DEFAULT '#7b1fa2',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        author TEXT NOT NULL,
        author_email TEXT,
        status TEXT DEFAULT 'À l''étude',
        category_id INTEGER REFERENCES categories(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
        author TEXT NOT NULL,
        author_email TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS beta_signups (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure columns exist (migration for existing tables)
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ideas' AND column_name='author_email') THEN
          ALTER TABLE ideas ADD COLUMN author_email TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ideas' AND column_name='category_id') THEN
          ALTER TABLE ideas ADD COLUMN category_id INTEGER REFERENCES categories(id);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ideas' AND column_name='image_url') THEN
          ALTER TABLE ideas ADD COLUMN image_url TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='sort_order') THEN
          ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='author_email') THEN
          ALTER TABLE comments ADD COLUMN author_email TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beta_signups' AND column_name='ip_address') THEN
          ALTER TABLE beta_signups ADD COLUMN ip_address TEXT;
        END IF;

        -- Fix ON DELETE CASCADE for votes
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='votes_idea_id_fkey') THEN
           ALTER TABLE votes DROP CONSTRAINT votes_idea_id_fkey;
        END IF;
        ALTER TABLE votes ADD CONSTRAINT votes_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

        -- Fix ON DELETE CASCADE for comments
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='comments_idea_id_fkey') THEN
           ALTER TABLE comments DROP CONSTRAINT comments_idea_id_fkey;
        END IF;
        ALTER TABLE comments ADD CONSTRAINT comments_idea_id_fkey FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;
      END $$;
    `);

    // Seed default categories (translated)
    await client.query(`
      INSERT INTO categories (name, description, color) VALUES
      ('Règles', 'Règles et directives du forum.', '#e53935'),
      ('Annonces', 'Dernières nouvelles et mises à jour.', '#fb8c00'),
      ('Questions', 'Besoin d''aide ? Posez vos questions ici.', '#f4511e'),
      ('Bugs, erreurs', 'Signalez les bugs ou erreurs rencontrés.', '#d32f2f')
      ON CONFLICT (name) DO NOTHING
    `);

    // Maintenance: Rename 'Tests' to 'Bugs, erreurs' if it exists and transfer ideas
    await client.query(`
      UPDATE ideas SET category_id = (SELECT id FROM categories WHERE name = 'Bugs, erreurs')
      WHERE category_id = (SELECT id FROM categories WHERE name = 'Tests')
    `);

    await client.query(`
      DELETE FROM categories WHERE name = 'Tests'
    `);

    // Now safe to delete old English categories
    await client.query(`
      DELETE FROM categories WHERE name IN ('Rules', 'Announcements', 'General Discussion', 'Guides', 'Coding', 'Themes', 'Plugins')
    `);
  } finally {
    client.release();
  }
}

export default pool;
