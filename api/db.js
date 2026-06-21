// api/db.js
// Vercel serverless function to sync menu, categories, and orders with Vercel KV (Redis).

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

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return response.status(500).json({ 
      error: 'Vercel KV is not configured. Please link a KV database to your project in the Vercel dashboard.' 
    });
  }

  const validKeys = ['menu', 'orders', 'categories'];
  if (!key || !validKeys.includes(key)) {
    return response.status(400).json({ error: 'Invalid or missing key parameter. Must be menu, orders, or categories.' });
  }

  try {
    if (method === 'GET') {
      const res = await fetch(`${kvUrl}/get/salwa_${key}`, {
        headers: { Authorization: `Bearer ${kvToken}` }
      });
      const data = await res.json();
      let value = null;
      if (data && data.result) {
        try {
          value = JSON.parse(data.result);
          // Auto-heal double JSON serialization from legacy code
          if (typeof value === 'string') {
            value = JSON.parse(value);
          }
        } catch (e) {
          console.warn("Failed parsing JSON result from KV, returning raw result:", e);
          value = data.result;
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

      // Save directly as single JSON string (without double-stringifying it)
      const res = await fetch(`${kvUrl}/set/salwa_${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: body
      });

      const result = await res.json();
      return response.status(200).json({ success: true, result });
    }

    return response.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
