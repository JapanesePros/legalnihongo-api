module.exports = async (req, res) => {
  const sheet = req.query.sheet || '';
  const sheetId = '1BLY5W_ArWGlUBPVS3KeS8nYKVxmcCktfxPhH3mQM49U';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    if (!match) return res.status(500).json({ error: 'No match', raw: text.slice(0, 300) });
    const json = JSON.parse(match[1]);
    const cols = json.table.cols.map(c => c.label);
    const rows = json.table.rows.map(r => {
      const obj = {};
      r.c.forEach((cell, i) => { obj[cols[i]] = cell ? cell.v : ''; });
      return obj;
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ items: rows });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
