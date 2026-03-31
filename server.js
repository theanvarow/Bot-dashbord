const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Paths
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');
const CSV_PATH = path.join(DATA_DIR, 'latest.csv');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Keep uploads in memory and only accept CSV files.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isCsvMime = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/csv'
    ].includes(file.mimetype);
    const isCsvName = path.extname(file.originalname || '').toLowerCase() === '.csv';

    if (isCsvMime || isCsvName) {
      return cb(null, true);
    }

    return cb(new Error('Only CSV files are allowed'));
  }
});

// Serve static files (index.html, etc.)
app.use(express.static(PUBLIC_DIR));

// Upload endpoint: saves CSV so all users can see it
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  try {
    fs.writeFileSync(CSV_PATH, req.file.buffer.toString('utf8'), 'utf8');
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error saving CSV:', err);
    return res.status(500).json({ error: 'Failed to save CSV on server' });
  }
});

// Data endpoint: returns last uploaded CSV (or 404 if none)
app.get('/data', (req, res) => {
  if (!fs.existsSync(CSV_PATH)) {
    return res.status(404).json({ error: 'No CSV uploaded yet' });
  }

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  fs.createReadStream(CSV_PATH).pipe(res);
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message || 'Upload failed' });
  }

  return next();
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
