const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function waitForDatabase() {
  console.log('Waiting for database to be ready...');
  
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database is ready!');
      await pool.end();
      return;
    } catch (err) {
      console.log(`Database not ready yet, retrying in 2 seconds... (attempt ${i + 1}/30)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.error('Database failed to become ready after 60 seconds');
  process.exit(1);
}

waitForDatabase(); 