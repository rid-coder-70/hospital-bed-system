const { Pool } = require('pg');

// Railway provides a single DATABASE_URL; local dev uses individual vars
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required by Railway Postgres
    })
  : new Pool({
      host    : process.env.DB_HOST     || 'localhost',
      port    : parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME     || 'hospital_bed_db',
      user    : process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      max     : 20,
      idleTimeoutMillis   : 30000,
      connectionTimeoutMillis: 2000,
    });

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = pool;
