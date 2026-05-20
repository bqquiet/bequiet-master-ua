const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const db = new Database('portfolio.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    link TEXT,
    is_draft INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    tags TEXT
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    is_read INTEGER DEFAULT 0
  );
`);

const rowCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
if (rowCount.count === 0) {
  const insert = db.prepare('INSERT INTO articles (title, content, type, date, tags) VALUES (?, ?, ?, ?, ?)');
  const today = new Date().toLocaleDateString();
  insert.run('Portfolio v2.0 Launch', 'Welcome to the new version of my portfolio! Built with vanilla HTML, CSS, and JavaScript.', 'Site Update', today, '#launch #update');
  insert.run('Added Admin Panel', 'Implemented a secure admin panel for managing site content and drafts.', 'Site Update', today, '#admin #feature');
  insert.run('Neon Effects Refined', 'Enhanced the visual identity with custom neon animations and glow effects.', 'Site Update', today, '#design #neon');
}

let currentProject = {
  name: 'portfolio-website',
  language: 'JavaScript',
  startTime: new Date().toISOString(),
  editor: 'VS Code',
  status: 'Coding'
};

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const PORT = parseInt(process.env.PORT || '3000', 10);

let viewersCount = 0;
io.on('connection', (socket) => {
  viewersCount++;
  io.emit('viewers_count', viewersCount);
  socket.on('disconnect', () => {
    viewersCount--;
    io.emit('viewers_count', viewersCount);
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// ── Articles ──────────────────────────────────────────────────────────────────
app.get('/api/articles', (req, res) => {
  const includeDrafts = req.query.includeDrafts === 'true';
  const auth = req.headers.authorization;
  try {
    const articles = (includeDrafts && auth === 'Bearer admin123')
      ? db.prepare('SELECT * FROM articles ORDER BY id DESC').all()
      : db.prepare('SELECT * FROM articles WHERE is_draft = 0 ORDER BY id DESC').all();
    res.json(articles);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.post('/api/articles', (req, res) => {
  if (req.headers.authorization !== 'Bearer admin123')
    return res.status(401).json({ error: 'Unauthorized' });
  const { title, content, type, date, link, is_draft, tags } = req.body;
  try {
    const info = db.prepare('INSERT INTO articles (title, content, type, date, link, is_draft, tags) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(title, content, type, date, link, is_draft ? 1 : 0, tags || '');
    res.json({ id: info.lastInsertRowid, title, content, type, date, link, is_draft, tags });
  } catch (e) {
    res.status(500).json({ error: 'Failed to add article' });
  }
});

app.post('/api/articles/:id/view', (req, res) => {
  try {
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update view count' });
  }
});

app.delete('/api/articles/:id', (req, res) => {
  if (req.headers.authorization !== 'Bearer admin123')
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// ── Messages ──────────────────────────────────────────────────────────────────
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body;
  try {
    db.prepare('INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)')
      .run(name, email, message, new Date().toISOString());
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/messages', (req, res) => {
  if (req.headers.authorization !== 'Bearer admin123')
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC').all());
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.delete('/api/messages/:id', (req, res) => {
  if (req.headers.authorization !== 'Bearer admin123')
    return res.status(401).json({ error: 'Unauthorized' });
  try {
    db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ── Status ────────────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    services: [
      { name: 'Main API', status: 'online', latency: '45ms' },
      { name: 'Database', status: 'online', latency: '12ms' },
      { name: 'GitHub Sync', status: 'online', latency: '120ms' }
    ],
    currentProject
  });
});

app.put('/api/status', (req, res) => {
  if (req.headers.authorization !== 'Bearer admin123')
    return res.status(401).json({ error: 'Unauthorized' });
  const { name, language, editor, status } = req.body;
  currentProject = {
    ...currentProject,
    name: name || currentProject.name,
    language: language || currentProject.language,
    editor: editor || currentProject.editor,
    status: status || currentProject.status,
    startTime: new Date().toISOString()
  };
  res.json({ success: true, currentProject });
});

// Fallback SPA
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api'))
    res.sendFile(path.join(__dirname, 'index.html'));
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
});
