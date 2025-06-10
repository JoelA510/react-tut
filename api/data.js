const path = require('path');
const fs = require('fs');

export default function handler(req, res) {
  const dbPath = path.join(process.cwd(), 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  res.status(200).json(db);
}