import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize database
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

// Seed initial data if empty
const rowCount = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number };
if (rowCount.count === 0) {
  const insert = db.prepare("INSERT INTO articles (title, content, type, date, tags) VALUES (?, ?, ?, ?, ?)");
  insert.run("Portfolio v2.0 Launch", "Welcome to the new version of my portfolio! Built with React, Tailwind, and SQLite.", "Site Update", new Date().toLocaleDateString(), "#launch #update #react");
  insert.run("Added Admin Panel", "Implemented a secure admin panel for managing site content and drafts.", "Site Update", new Date().toLocaleDateString(), "#admin #feature");
  insert.run("Neon Effects Refined", "Enhanced the visual identity with custom neon animations and glow effects.", "Site Update", new Date().toLocaleDateString(), "#design #neon");
}

// Current project state (mocking WakaTime/VS Code activity)
let currentProject = {
  name: "portfolio-website",
  language: "TypeScript",
  startTime: new Date().toISOString(),
  editor: "VS Code",
  status: "Coding"
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/articles", (req, res) => {
    const includeDrafts = req.query.includeDrafts === 'true';
    const adminPassword = req.headers.authorization;
    
    try {
      let articles;
      if (includeDrafts && adminPassword === "Bearer admin123") {
        articles = db.prepare("SELECT * FROM articles ORDER BY id DESC").all();
      } else {
        articles = db.prepare("SELECT * FROM articles WHERE is_draft = 0 ORDER BY id DESC").all();
      }
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.post("/api/articles", (req, res) => {
    const { title, content, type, date, link, is_draft, tags } = req.body;
    
    const adminPassword = req.headers.authorization;
    if (adminPassword !== "Bearer admin123") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const stmt = db.prepare("INSERT INTO articles (title, content, type, date, link, is_draft, tags) VALUES (?, ?, ?, ?, ?, ?, ?)");
      const info = stmt.run(title, content, type, date, link, is_draft ? 1 : 0, tags || "");
      res.json({ id: info.lastInsertRowid, title, content, type, date, link, is_draft, tags });
    } catch (error) {
      res.status(500).json({ error: "Failed to add article" });
    }
  });

  app.post("/api/articles/:id/view", (req, res) => {
    try {
      const stmt = db.prepare("UPDATE articles SET views = views + 1 WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update view count" });
    }
  });

  app.get("/api/status", async (req, res) => {
    // Mock health check
    res.json({
      services: [
        { name: "Main API", status: "online", latency: "45ms" },
        { name: "Database", status: "online", latency: "12ms" },
        { name: "GitHub Sync", status: "online", latency: "120ms" }
      ],
      currentProject
    });
  });

  app.delete("/api/articles/:id", (req, res) => {
    const adminPassword = req.headers.authorization;
    if (adminPassword !== "Bearer admin123") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const stmt = db.prepare("DELETE FROM articles WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Messages API
  app.post("/api/messages", (req, res) => {
    const { name, email, message } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)");
      stmt.run(name, email, message, new Date().toISOString());
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/messages", (req, res) => {
    const adminPassword = req.headers.authorization;
    if (adminPassword !== "Bearer admin123") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const messages = db.prepare("SELECT * FROM messages ORDER BY id DESC").all();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.delete("/api/messages/:id", (req, res) => {
    const adminPassword = req.headers.authorization;
    if (adminPassword !== "Bearer admin123") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const stmt = db.prepare("DELETE FROM messages WHERE id = ?");
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Status Update API
  app.put("/api/status", (req, res) => {
    const adminPassword = req.headers.authorization;
    if (adminPassword !== "Bearer admin123") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { name, language, editor, status } = req.body;
    currentProject = {
      ...currentProject,
      name: name || currentProject.name,
      language: language || currentProject.language,
      editor: editor || currentProject.editor,
      status: status || currentProject.status,
      startTime: new Date().toISOString() // reset start time on update
    };
    res.json({ success: true, currentProject });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
