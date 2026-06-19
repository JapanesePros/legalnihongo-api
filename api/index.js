const https = require('https');

module.exports = async function handler(req, res) {
  const sheet = req.query.sheet || '';
  const url = `https://script.google.com/macros/s/AKfycbzDF9h5mLXfObKBJb3r08EzgzHt0C6VcPv7A-RZ7o4kFUMSZ81M1eJhXWVILlFntldC/exec?sheet=${encodeURIComponent(sheet)}`;

  function fetchWithRedirects(targetUrl, redirectCount = 0) {
    return new Promise((resolve, reject) => {
      if (redirectCount > 5) return reject(new Error('Too many redirects'));
      https.get(targetUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return resolve(fetchWithRedirects(response.headers.location, redirectCount + 1));
        }
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(data));
        response.on('error', reject);
      }).on('error', reject);
    });
  }

  try {
    const raw = await fetchWithRedirects(url);
    const data = JSON.parse(raw);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
