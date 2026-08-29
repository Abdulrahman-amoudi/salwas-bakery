// api/db.js
// Vercel serverless function to sync menu and categories with PostgreSQL (Neon, Vercel Postgres, Supabase).
import pg from 'pg';
const { Pool } = pg;

// Define pool outside handler to reuse connection across warm serverless functions
const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
let pool = null;

if (pgUrl) {
  pool = new Pool({
    connectionString: pgUrl,
    ssl: {
      rejectUnauthorized: false // Required for serverless database connections (e.g. Neon, Supabase)
    },
    max: 10,
    idleTimeoutMillis: 30000
  });
}

export default async function handler(request, response) {
  // Disable caching so changes on one device reflect immediately on all devices
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  // CORS Headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
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

  // Health check / database status
  if (key === 'status') {
    if (!pgUrl || !pool) {
      return response.status(200).json({
        configured: false,
        message: 'Postgres database environment variable (POSTGRES_URL or DATABASE_URL) is not set.'
      });
    }
    try {
      await pool.query('SELECT 1');
      return response.status(200).json({
        configured: true,
        connected: true,
        message: 'PostgreSQL database connected and operational.'
      });
    } catch (err) {
      return response.status(200).json({
        configured: true,
        connected: false,
        error: err.message
      });
    }
  }

  if (!pgUrl || !pool) {
    return response.status(503).json({ 
      error: 'PostgreSQL database is not configured. Please link a Postgres database (such as Neon or Vercel Postgres) in the Vercel dashboard.',
      configured: false
    });
  }

  const validKeys = ['menu', 'categories'];
  if (!key || !validKeys.includes(key)) {
    return response.status(400).json({ error: 'Invalid or missing key parameter. Must be "menu" or "categories".' });
  }

  try {
    // Ensure the key-value table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS salwa_kv (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    if (method === 'GET') {
      const res = await pool.query('SELECT value, updated_at FROM salwa_kv WHERE key = $1', [key]);
      let value = null;
      let updatedAt = null;
      if (res.rows.length > 0) {
        updatedAt = res.rows[0].updated_at;
        try {
          value = JSON.parse(res.rows[0].value);
          // Auto-heal double JSON serialization if present
          if (typeof value === 'string') {
            value = JSON.parse(value);
          }
        } catch (e) {
          console.warn('Failed parsing JSON result from Postgres, returning raw result:', e);
          value = res.rows[0].value;
        }
      }
      return response.status(200).json({ value, updatedAt, key });
    }

    if (method === 'POST') {
      let bodyData = request.body;

      if (!bodyData || (typeof bodyData === 'object' && Object.keys(bodyData).length === 0)) {
        let rawBody = '';
        await new Promise((resolve) => {
          request.on('data', chunk => rawBody += chunk);
          request.on('end', resolve);
        });
        if (rawBody) {
          try {
            bodyData = JSON.parse(rawBody);
          } catch (e) {
            bodyData = rawBody;
          }
        }
      }

      if (bodyData === undefined || bodyData === null || bodyData === '') {
        return response.status(400).json({ error: 'Missing request body' });
      }

      const valueString = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData);

      // Verify the body is valid JSON
      try {
        JSON.parse(valueString);
      } catch (err) {
        return response.status(400).json({ error: 'Body must be valid JSON' });
      }

      // Upsert into key-value store with timestamp
      await pool.query(`
        INSERT INTO salwa_kv (key, value, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (key)
        DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
      `, [key, valueString]);

      return response.status(200).json({ success: true, key, timestamp: new Date().toISOString() });
    }

    return response.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Database handler error:', err);
    return response.status(500).json({ error: err.message });
  }
}
