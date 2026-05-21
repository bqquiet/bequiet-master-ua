<div align="center">

```
██████╗ ███████╗ ██████╗ ██╗   ██╗██╗███████╗████████╗
██╔══██╗██╔════╝██╔═══██╗██║   ██║██║██╔════╝╚══██╔══╝
██████╔╝█████╗  ██║   ██║██║   ██║██║█████╗     ██║   
██╔══██╗██╔══╝  ██║▄▄ ██║██║   ██║██║██╔══╝     ██║   
██████╔╝███████╗╚██████╔╝╚██████╔╝██║███████╗   ██║   
╚═════╝ ╚══════╝ ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝   ╚═╝   
```

**Personal portfolio website — clean, minimal, no noise.**

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/bqquiet/bequiet?style=flat-square&color=yellow)](https://github.com/bqquiet/bequiet/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/bqquiet/bequiet?style=flat-square&color=green)](https://github.com/bqquiet/bequiet/commits)

<br/>

> A minimal, dark-themed personal portfolio & blog built entirely with  
> **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no noise.

<br/>

🌐 **[bequiet.dev](https://bqquiet.github.io/bequiet-master-ua/)** — Live Demo

</div>

---

## 📸 Preview

<div align="center">

| Dark Mode | Light Mode |
|:---------:|:----------:|
| ![Dark](![alt text](image.png)) | ![Light](![alt text](image-1.png)) |

| Home — GitHub Explorer | News & Blog |
|:---------------------:|:-----------:|
| ![Explorer](![alt text](image-3.png)) | ![News](![alt text](image-2.png)) |

> 💡 Replace placeholders above with actual screenshots from your live site.

</div>

---

## ✨ Features

- 🌑 **Dark / Light theme** — instant toggle, persisted in `localStorage`
- 🌍 **Bilingual** — full EN / UA interface with one-click switching
- ⌨️ **Typing effect** — animated greeting on the homepage
- 📁 **GitHub Repo Explorer** — browse any repo's file tree directly on the site via GitHub API
- 📰 **News & Blog** — rich-text posts (Quill WYSIWYG), tag filtering, per-article view counter
- 🔴 **Live Viewers** — real-time online count powered by Socket.io
- 📬 **Contact Form** — messages stored in SQLite, readable in the admin inbox
- 🔐 **Admin Panel** — publish/draft posts, manage inbox, update live coding status
- 🎹 **Secret Keyboard Shortcut** — type `bequiet` anywhere to open the admin panel
- 🔇 **Focus Mode** — navbar hides automatically while reading articles
- 🔊 **Click Sounds** — subtle audio feedback on interactions
- ⬆️ **Back To Top** — smooth-scroll button appears on deep scroll

---

## 🗂 Project Structure

```
bequiet/
├── index.html          # SPA shell — single entry point
├── style.css           # All styles: CSS Variables, animations, layout
├── app.js              # Full frontend — hash router, all pages & logic
├── server.js           # Express REST API + Socket.io + SQLite
├── package.json
└── portfolio.db        # SQLite database (auto-created on first run)
```

No build step. No bundler. No config files. Just open and run.

---

## ⚙️ Tech Stack

**Frontend**

| What | How |
|---|---|
| UI & Routing | Vanilla JS, Hash-based SPA (`location.hash`) |
| Styling | Pure CSS3 with Custom Properties (variables) |
| Animations | CSS `@keyframes` + `transition` |
| Rich Text | [Quill.js](https://quilljs.com/) via CDN |
| Real-time | [Socket.io](https://socket.io/) client via CDN |
| GitHub Data | GitHub REST API (repos, events) |

**Backend**

| What | How |
|---|---|
| Server | [Express](https://expressjs.com/) |
| Real-time | [Socket.io](https://socket.io/) |
| Database | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (embedded SQLite) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0`
- **npm** `>= 9.0.0`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/bqquiet/bequiet.git
cd bequiet

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) — the database is created automatically on first run.

### Environment Variables

Create a `.env` file or set these before running:

```env
PORT=3000   # optional — defaults to 3000
```

### Development

```bash
# Run with auto-restart on file changes
npm install -g nodemon
nodemon server.js
```

---

## 📡 API Reference

All protected endpoints require the header:  
`Authorization: Bearer <your-password>`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/articles` | — | Get published articles |
| `GET` | `/api/articles?includeDrafts=true` | ✅ | Get all articles including drafts |
| `POST` | `/api/articles` | ✅ | Create a new article |
| `POST` | `/api/articles/:id/view` | — | Increment view count |
| `DELETE` | `/api/articles/:id` | ✅ | Delete an article |
| `POST` | `/api/messages` | — | Submit a contact message |
| `GET` | `/api/messages` | ✅ | Get all contact messages |
| `DELETE` | `/api/messages/:id` | ✅ | Delete a message |
| `GET` | `/api/status` | — | Get current coding status |
| `PUT` | `/api/status` | ✅ | Update coding status |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

### Reporting Bugs

1. Check [existing issues](https://github.com/bqquiet/bequiet/issues) first
2. Open a new issue with a clear title and steps to reproduce
3. Include your OS, Node.js version, and browser

### Suggesting Features

Open an issue with the `enhancement` label and describe your idea — what problem it solves and how you'd implement it.

### Submitting a Pull Request

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/bequiet.git
cd bequiet

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes, then commit
git add .
git commit -m "feat: describe your change"

# 5. Push and open a PR
git push origin feature/your-feature-name
```

**Commit message convention:**

```
feat:     new feature
fix:      bug fix
style:    CSS / visual changes
refactor: code restructure without behavior change
docs:     documentation updates
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 🖤 by [bequiet](https://github.com/bqquiet)

*"The quieter you become, the more you are able to hear."*

</div>
