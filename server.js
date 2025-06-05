const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const MEDIA_DIR = process.env.MEDIA_DIR || path.join(__dirname, 'media');
const PROFILES_PATH = path.join(__dirname, 'profiles.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/avatars', express.static(__dirname));

app.get('/api/profiles', (req, res) => {
  if (!fs.existsSync(PROFILES_PATH)) return res.json([]);
  const data = fs.readFileSync(PROFILES_PATH, 'utf8');
  try {
    res.json(JSON.parse(data));
  } catch (e) {
    res.json([]);
  }
});

// helper to get categories (subdirectories)
function getCategories() {
  return fs.readdirSync(MEDIA_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// helper to get videos inside a category
function getVideos(category) {
  const catDir = path.join(MEDIA_DIR, category);
  if (!fs.existsSync(catDir)) return [];
  return fs.readdirSync(catDir)
    .filter(file => file.match(/\.(mp4|mkv|webm|mov)$/i));
}

app.get('/api/categories', (req, res) => {
  res.json(getCategories());
});

app.get('/api/videos/:category', (req, res) => {
  res.json(getVideos(req.params.category));
});

// streaming endpoint
app.get('/video/:category/:filename', (req, res) => {
  const filePath = path.join(MEDIA_DIR, req.params.category, req.params.filename);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const [startStr, endStr] = range.replace(/bytes=|\s+/g, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
