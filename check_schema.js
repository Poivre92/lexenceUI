const pool = require('./src/lib/db');

async function checkSchema() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'ideas';
    `);
        console.log('Ideas table columns:', res.rows);

        const constraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = 'ideas'::regclass;
    `);
        console.log('Ideas table constraints:', constraints.rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
