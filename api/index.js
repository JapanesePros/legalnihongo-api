export default async function handler(req, res) {
  const sheet = req.query.sheet || '';
  const base = 'https://script.google.com/macros/s/AKfycbzDF9h5mLXfObKBJb3r08EzgzHt0C6VcPv7A-RZ7o4kFUMSZ81M1eJhXWVILlFntldC/exec';
  
  const response = await fetch(`${base}?sheet=${sheet}`, {
    redirect: 'follow',
    headers: { 'Accept': 'application/json' }
  });
  
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
