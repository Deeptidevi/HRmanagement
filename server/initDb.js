const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function initializeDatabase() {
  console.log('🔄 Initializing PostgreSQL database for AmaHR Enterprise HRMS...');
  try {
    const schemaSqlPath = path.join(__dirname, '..', 'schema.sql');
    const sqlContent = fs.readFileSync(schemaSqlPath, 'utf-8');

    console.log('📜 Executing schema.sql migration...');
    await db.query(sqlContent);

    console.log('✅ PostgreSQL tables created and seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error executing database initialization:', err);
    process.exit(1);
  }
}

initializeDatabase();
