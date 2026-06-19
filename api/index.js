const https = require('https');

function follow(url, depth, res) {
  if (depth > 10) return res.status(500).json({ error: 'Too many redirects' });
  
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
    }
  };

  https.get(url, options, (r) => {
    if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
      return follow(r.headers.location, depth + 1, res);
    }
    let data = '';
    r.on('data', c => data += c);
    r.on('end', () => {
      try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(JSON.parse(data));
      } catch(e) {
        res.status(500).json({ error: e.message, status: r.statusCode, raw: data.slice(0, 300) });
      }
    });
    r.on('error', e => res.status(500).json({ error: e.message }));
  }).on('error', e => res.status(500).json({ error: e.message }));
}

module.exports = (req, res) => {
  const sheet = req.query.sheet || '';
  const url = 'https://script.google.com/macros/s/AKfycbzDF9h5mLXfObKBJb3r08EzgzHt0C6VcPv7A-RZ7o4kFUMSZ81M1eJhXWVILlFntldC/exec?sheet=' + sheet;
  follow(url, 0, res);
};
