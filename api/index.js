const https = require('https');

module.exports = (req, res) => {
  const sheet = req.query.sheet || '';
  const url = 'https://script.google.com/macros/s/AKfycbzDF9h5mLXfObKBJb3r08EzgzHt0C6VcPv7A-RZ7o4kFUMSZ81M1eJhXWVILlFntldC/exec?sheet=' + sheet;

  https.get(url, (r1) => {
    const location = r1.headers.location;
    if (!location) return res.status(500).json({ error: 'No redirect' });

    https.get(location, (r2) => {
      let data = '';
      r2.on('data', c => data += c);
      r2.on('end', () => {
        try {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.json(JSON.parse(data));
        } catch(e) {
          res.status(500).json({ error: e.message, raw: data.slice(0, 200) });
        }
      });
    }).on('error', e => res.status(500).json({ error: e.message }));
  }).on('error', e => res.status(500).json({ error: e.message }));
};
