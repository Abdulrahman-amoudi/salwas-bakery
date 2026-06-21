// api/db.js
// Vercel serverless function to sync menu, categories, and orders with PostgreSQL.
import pg from 'pg';
const { Pool } = pg;

// Define pool outside handler to reuse connection across warm functions
const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
let pool = null;

if (pgUrl) {
  pool = new Pool({
    connectionString: pgUrl,
    ssl: {
      rejectUnauthorized: false // Required for serverless database connections (e.g. Neon)
    }
  });
}

export default async function handler(request, response) {
  // CORS Headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { method } = request;
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const key = url.searchParams.get('key');

  if (!pgUrl || !pool) {
    return response.status(500).json({ 
      error: 'PostgreSQL database is not configured. Please link a Postgres database (such as Neon or Vercel Postgres) in the Vercel dashboard.' 
    });
  }

  const validKeys = ['menu', 'orders', 'categories'];
  if (!key || !validKeys.includes(key)) {
    return response.status(400).json({ error: 'Invalid or missing key parameter. Must be menu, orders, or categories.' });
  }

  try {
    // Ensure the key-value table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS salwa_kv (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    if (method === 'GET') {
      const res = await pool.query('SELECT value FROM salwa_kv WHERE key = $1', [key]);
      let value = null;
      if (res.rows.length > 0) {
        try {
          value = JSON.parse(res.rows[0].value);
          // Auto-heal double JSON serialization from legacy code if present
          if (typeof value === 'string') {
            value = JSON.parse(value);
          }
        } catch (e) {
          console.warn("Failed parsing JSON result from Postgres, returning raw result:", e);
          value = res.rows[0].value;
        }
      }
      return response.status(200).json({ value });
    }

    if (method === 'POST') {
      let body = '';
      await new Promise((resolve) => {
        request.on('data', chunk => body += chunk);
        request.on('end', resolve);
      });

      if (!body) {
        return response.status(400).json({ error: 'Missing request body' });
      }

      // Verify the body is valid JSON
      try {
        JSON.parse(body);
      } catch (err) {
        return response.status(400).json({ error: 'Body must be valid JSON' });
      }

      // Save directly as single JSON string in PostgreSQL key-value store
      await pool.query(`
        INSERT INTO salwa_kv (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key)
        DO UPDATE SET value = $2
      `, [key, body]);

      return response.status(200).json({ success: true });
    }

    return response.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error("Database handler error:", err);
    return response.status(500).json({ error: err.message });
  }
}
