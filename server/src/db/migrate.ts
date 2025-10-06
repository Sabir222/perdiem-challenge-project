import pool from "./connection";

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        welcome_message TEXT,
        theme TEXT DEFAULT '#3b82f6',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      INSERT INTO stores (name, slug, welcome_message, theme) 
      VALUES 
        ('Store A', 'a', 'Welcome to Store A', '#3b82f6'),
        ('Store B', 'b', 'Welcome to Store B', '#ef4444'),
        ('Store C', 'c', 'Welcome to Store C', '#10b981')
      ON CONFLICT (slug) DO NOTHING;
    `);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

migrate();
