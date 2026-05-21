/* ============================================================
   bequiet. — Vanilla JS SPA
   Converted from React/TypeScript
   ============================================================ */

// ── STATE ────────────────────────────────────────────────────
const state = {
  theme:       localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  lang:        localStorage.getItem('lang')  || 'en',
  viewers:     1,
  adminAuth:   false,
  quill:       null,
  selectedRepo: null,
  typingTimer: null,
  keyBuffer:   '',
  keyTimeout:  null,
  activeAdminTab: 'news',
  newsFilter:  null,
  adminFormData: { title:'', content:'', type:'Blog', link:'', tags:'' },
  statusData:  { name:'', language:'', editor:'', status:'Coding' },
};

// ── TRANSLATIONS ─────────────────────────────────────────────
const i18n = {
  en: {
    nav: { home:'Home', news:'News', about:'About', contact:'Contact' },
    home: {
      role: 'Software Engineering Student & Freelancer',
      sub:  "I'm a first-year Software Engineering student and freelancer. I build clean, efficient, and elegant software solutions without unnecessary noise.",
      stack: 'Tech Stack', stack_sub: 'The tools I use daily.',
      recent: 'Recent Activity',
    },
    about: {
      title: 'About Me',
      p1: "I'm a first-year Software Engineering student at TNTU. My approach to development is simple: code should be clean, logical, and quiet. I don't like unnecessary complexity or 'noise' in architecture.",
      p2: "I started my journey with automation scripts and bots, and now I'm diving deep into full-stack development and system engineering. I'm always looking for the most efficient way to solve a problem.",
      p3: "When I'm not coding, I'm likely exploring new technologies or working on freelance projects. I value transparency, precision, and high-quality results.",
      skills: 'Technical Skills', exp: 'Experience & Education',
    },
    news: {
      title: 'News & Updates',
      sub:   'The latest articles, project updates, and GitHub activity.',
      read_more: 'Read more', view_gh: 'View on GitHub',
      no_news: 'No updates published yet.',
    },
    contact: {
      title: "Get in Touch",
      sub:   "Have a project in mind or just want to say hi? Feel free to reach out.",
      copy: 'Copy', copied: 'Copied!',
      email_desc:    'Drop me an email for business inquiries.',
      github_desc:   'Check out my repositories and contributions.',
      telegram_desc: 'Fastest way to reach me directly.',
    },
    admin: {
      dashboard: 'Admin Dashboard', new_entry: 'New Entry',
      publish: 'Publish Entry', save_draft: 'Save Draft',
      manage: 'Manage Entries', views: 'views',
    },
    viewers: { online:'online', viewer:'viewer', viewers:'viewers' },
  },
  ua: {
    nav: { home:'Головна', news:'Новини', about:'Про мене', contact:'Контакти' },
    home: {
      role: "Студент ПЗ та Фрілансер",
      sub:  "Я студент першого курсу спеціальності 'Інженерія програмного забезпечення' та фрілансер. Створюю чисті, ефективні та елегантні програмні рішення без зайвого шуму.",
      stack: 'Стек технологій', stack_sub: 'Інструменти, які я використовую щодня.',
      recent: 'Остання активність',
    },
    about: {
      title: 'Про мене',
      p1: "Я студент першого курсу спеціальності 'Інженерія програмного забезпечення' в ТНТУ. Мій підхід до розробки простий: код має бути чистим, логічним і 'тихим'.",
      p2: "Мій шлях почався з скриптів автоматизації та ботів, а зараз я заглиблююсь у full-stack розробку та системну інженерію.",
      p3: "Коли я не програмую, я, швидше за все, вивчаю нові технології або працюю над фріланс-проектами. Я ціную прозорість, точність і високу якість результату.",
      skills: 'Технічні навички', exp: 'Досвід та освіта',
    },
    news: {
      title: 'Новини та оновлення',
      sub:   'Останні статті, оновлення проектів та активність на GitHub.',
      read_more: 'Читати далі', view_gh: 'Дивитись на GitHub',
      no_news: 'Оновлень поки немає.',
    },
    contact: {
      title: "Зв'яжіться зі мною",
      sub:   "Маєте проект або просто хочете привітатися? Пишіть мені.",
      copy: 'Копіювати', copied: 'Скопійовано!',
      email_desc:    'Напишіть мені на пошту для ділових пропозицій.',
      github_desc:   'Перегляньте мої репозиторії та внески.',
      telegram_desc: "Найшвидший спосіб зв'язатися зі мною напряму.",
    },
    admin: {
      dashboard: 'Панель адміна', new_entry: 'Новий запис',
      publish: 'Опублікувати', save_draft: 'В чернетки',
      manage: 'Керування', views: 'переглядів',
    },
    viewers: { online:'на сайті', viewer:'людина', viewers:'людей' },
  },
};

function t(keyPath) {
  const parts = keyPath.split('.');
  let obj = i18n[state.lang];
  for (const p of parts) { obj = obj?.[p]; }
  return obj || keyPath;
}

// ── ICONS ────────────────────────────────────────────────────
const ICONS = {
  terminal:       `<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>`,
  sun:            `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`,
  moon:           `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  github:         `<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>`,
  send:           `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  mail:           `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  briefcase:      `<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`,
  code2:          `<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>`,
  'arrow-up-right': `<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>`,
  plus:           `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  trash2:         `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>`,
  star:           `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  'external-link': `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
  menu:           `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`,
  x:              `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  loader2:        `<path d="M21 12a9 9 0 1 1-6.219-8.56"/>`,
  folder:         `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
  'file-text':    `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>`,
  'chevron-left': `<polyline points="15 18 9 12 15 6"/>`,
  zap:            `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  clock:          `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  sparkles:       `<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>`,
  download:       `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  share2:         `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>`,
  'arrow-up':     `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>`,
  copy:           `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
  'check-circle2': `<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>`,
  activity:       `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  globe:          `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  'message-square': `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  newspaper:      `<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>`,
  reply:          `<polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>`,
  'map-pin':      `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
};

function icon(name, size = 20, classes = '') {
  const d = ICONS[name] || '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${classes}">${d}</svg>`;
}

// ── SOUNDS ───────────────────────────────────────────────────
function playClick() {
  const a = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  a.volume = 0.25; a.play().catch(()=>{});
}
function playSuccess() {
  const a = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
  a.volume = 0.25; a.play().catch(()=>{});
}

// ── THEME ────────────────────────────────────────────────────
function applyTheme(theme) {
  state.theme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.classList.toggle('dark',  theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  // Update button icon
  const btn = document.getElementById('theme-btn');
  if (btn) btn.innerHTML = theme === 'dark' ? icon('sun',20) : icon('moon',20);
}
function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  playClick();
}

// ── LANGUAGE ─────────────────────────────────────────────────
function setLang(lng) {
  state.lang = lng;
  localStorage.setItem('lang', lng);
  playClick();
  // Re-render navbar links and current page
  renderNavbar();
  router(true);
}

// ── NAVIGATE ─────────────────────────────────────────────────
function navigate(path) {
  location.hash = '#' + path;
  playClick();
}

// ── ROUTER ───────────────────────────────────────────────────
const ROUTES = {
  '/':        { render: pageHome,    init: initHome    },
  '/news':    { render: pageNews,    init: initNews    },
  '/about':   { render: pageAbout,   init: null        },
  '/contact': { render: pageContact, init: null },
  '/admin':   { render: pageAdmin,   init: initAdmin   },
};

function router(skipTransition = false) {
  const hash = location.hash.replace('#', '') || '/';
  const route = ROUTES[hash] || { render: pageNotFound, init: null };

  const isAdmin = hash === '/admin';

  // Show/hide navbar & footer
  document.getElementById('navbar').style.display = isAdmin ? 'none' : '';
  document.getElementById('site-footer').style.display = isAdmin ? 'none' : '';

  // Focus mode
  document.body.classList.remove('focus-mode');

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.path === hash);
  });

  const content = document.getElementById('main-content');

  const doRender = () => {
    state.selectedRepo = null;
    content.innerHTML = route.render();
    content.classList.remove('fade-out');
    content.classList.add('fade-in');
    if (route.init) route.init();
    updateActiveNavLinks(hash);
    window.scrollTo(0, 0);
  };

  if (skipTransition) { doRender(); return; }

  content.classList.add('fade-out');
  content.classList.remove('fade-in');
  setTimeout(doRender, 200);
}

function updateActiveNavLinks(hash) {
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.path === hash);
  });
}

// ── NAVBAR ───────────────────────────────────────────────────
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const links = [
    { key:'nav.home',    path:'/'        },
    { key:'nav.news',    path:'/news'    },
    { key:'nav.about',   path:'/about'   },
    { key:'nav.contact', path:'/contact' },
  ];

  const hash = location.hash.replace('#','') || '/';

  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="#/" class="nav-logo" onclick="playClick()">
        <span class="logo-icon">${icon('terminal', 20)}</span>
        bequiet<span class="logo-dot">.</span>
      </a>

      <nav class="nav-links">
        ${links.map(l => `
          <a href="#${l.path}" class="nav-link${hash===l.path?' active':''}" data-path="${l.path}" onclick="playClick()">
            ${t(l.key)}
          </a>
        `).join('')}
      </nav>

      <div class="nav-controls">
        <div class="lang-switcher">
          <button class="lang-btn${state.lang==='en'?' active':''}" onclick="setLang('en')">EN</button>
          <div class="lang-divider"></div>
          <button class="lang-btn${state.lang==='ua'?' active':''}" onclick="setLang('ua')">UA</button>
        </div>
        <button id="theme-btn" class="theme-btn" onclick="toggleTheme()" title="Toggle theme">
          ${state.theme==='dark' ? icon('sun',20) : icon('moon',20)}
        </button>
        <button class="menu-btn" id="mobile-menu-btn" onclick="toggleMobileMenu()">
          ${icon('menu',24)}
        </button>
      </div>
    </div>

    <div class="mobile-menu" id="mobile-menu">
      <div class="mobile-menu-inner">
        ${links.map(l => `
          <a href="#${l.path}" class="nav-link${hash===l.path?' active':''}" data-path="${l.path}"
             onclick="closeMobileMenu(); playClick()">
            ${t(l.key)}
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function closeMobileMenu() {
  const m = document.getElementById('mobile-menu');
  if (m) m.classList.remove('open');
}

// ── FOOTER ───────────────────────────────────────────────────
function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4 class="footer-heading">Status</h4>
          <div id="footer-status">
            <div class="status-row">
              <span class="status-name"><span class="status-dot status-online"></span>Loading...</span>
            </div>
          </div>
        </div>
        <div>
          <h4 class="footer-heading">Current Activity (VS Code)</h4>
          <div id="footer-project"><p style="font-size:.75rem;color:var(--text-muted)">Loading...</p></div>
        </div>
        <div>
          <h4 class="footer-heading">Connect</h4>
          <div class="footer-social">
            <a href="https://github.com/bqquiet" target="_blank" class="social-link" rel="noopener">${icon('github',20)}</a>
            <a href="mailto:dhdbcfdff@gmail.com" class="social-link">${icon('mail',20)}</a>
            <a href="https://t.me/bqquiet" target="_blank" class="social-link" rel="noopener">${icon('send',20)}</a>
          </div>
        </div>
      </div>
      <div class="footer-copy">
        <p>© ${new Date().getFullYear()} bequiet. All rights reserved.</p>
      </div>
    </div>
  `;
  // Fetch status
  fetch('/api/status').then(r=>r.json()).then(data => {
    const s = document.getElementById('footer-status');
    const p = document.getElementById('footer-project');
    if (s && data.services) {
      s.innerHTML = data.services.map(sv => `
        <div class="status-row">
          <span class="status-name">
            <span class="status-dot ${sv.status==='online'?'status-online':'status-offline'}"></span>
            ${sv.name}
          </span>
          <span class="status-latency">${sv.latency}</span>
        </div>
      `).join('');
    }
    if (p && data.currentProject) {
      const cp = data.currentProject;
      p.innerHTML = `
        <div class="current-project">
          <div class="project-coding-label">${icon('activity',12)} Coding Now</div>
          <div class="project-name">${cp.name}</div>
          <div class="project-lang">${cp.language}</div>
        </div>
      `;
    } else if (p) {
      p.innerHTML = `<p style="font-size:.75rem;color:var(--text-muted)">Not coding right now.</p>`;
    }
  }).catch(()=>{});
}

// ── LIVE VIEWERS ─────────────────────────────────────────────
function renderLiveViewers() {
  const el = document.getElementById('live-viewers');
  if (!el) return;
  const v = state.viewers;
  const vLabel = v===1 ? t('viewers.viewer') : t('viewers.viewers');
  el.innerHTML = `
    <div class="ping-dot">
      <span class="ping-ring"></span>
      <span class="ping-inner"></span>
    </div>
    <span class="viewers-text">${v} ${vLabel} ${t('viewers.online')}</span>
  `;
}

function initSocket() {
  try {
    const socket = io();
    socket.on('viewers_count', count => {
      state.viewers = count;
      renderLiveViewers();
    });
  } catch(e) { /* socket.io not available in dev without server */ }
}

// ── BACK TO TOP ──────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.innerHTML = icon('arrow-up', 20);
  btn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
    playClick();
  });
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

// ── SECRET ADMIN ─────────────────────────────────────────────
function initSecretAdmin() {
  document.addEventListener('keydown', e => {
    clearTimeout(state.keyTimeout);
    state.keyBuffer += e.key.toLowerCase();
    if (state.keyBuffer.length > 7) state.keyBuffer = state.keyBuffer.slice(-7);
    if (state.keyBuffer === 'bequiet') {
      location.hash = '#/admin';
      state.keyBuffer = '';
    }
    state.keyTimeout = setTimeout(() => { state.keyBuffer = ''; }, 2000);
  });
}

// ── FOCUS MODE (news page) ───────────────────────────────────
function initFocusMode() {
  const hash = location.hash.replace('#','') || '/';
  const onScroll = () => {
    if (hash === '/news') {
      document.body.classList.toggle('focus-mode', window.scrollY > 200);
    }
  };
  window.addEventListener('scroll', onScroll);
  // Clean up on next navigation
  window._focusModeCleanup = () => {
    window.removeEventListener('scroll', onScroll);
    document.body.classList.remove('focus-mode');
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── HOME PAGE ────────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageHome() {
  const techs = ['Python','C/C++','HTML','CSS','SQL','GIT','GITHUB','DOCKER','VSCODE'];
  return `
    <div style="display:flex;flex-direction:column;gap:3rem;">
      <!-- Hero -->
      <div class="glass-card hero-card">
        <div class="avatar-wrapper">
          <img class="avatar-img" src="https://github.com/bqquiet.png"
               alt="Andrii Bakaleiko" referrerpolicy="no-referrer" />
        </div>
        <div class="hero-text">
          <h1 class="hero-title" id="hero-title">
            <span class="cursor-blink">|</span>
          </h1>
          <p class="hero-role">${t('home.role')}</p>
          <p class="hero-sub">${t('home.sub')}</p>
          <div class="hero-actions">
            <a href="#/about" class="btn btn-primary" onclick="playClick()">${t('nav.about')}</a>
            <a href="#/contact" class="btn btn-outline" onclick="playClick()">${t('nav.contact')}</a>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div class="home-grid">
        <!-- Stack -->
        <div class="glass-card stack-card">
          <div class="section-title">${icon('code2',20)} ${t('home.stack')}</div>
          <p class="section-sub">${t('home.stack_sub')}</p>
          <div class="tech-tags">
            ${techs.map(tech=>`<span class="tech-tag">${tech}</span>`).join('')}
          </div>
        </div>

        <!-- Repos -->
        <div class="glass-card repos-card">
          <div id="repos-panel">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
              <div class="section-title">${icon('github',20)} ${t('home.recent')}</div>
              <a href="https://github.com/bqquiet" target="_blank" rel="noopener"
                 style="font-size:.875rem;color:var(--text-muted);display:flex;align-items:center;gap:.25rem;transition:color .2s;"
                 onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'"
                 onclick="playClick()">
                GitHub ${icon('arrow-up-right',14)}
              </a>
            </div>
            <div class="repos-grid" id="repos-grid">
              <div class="skeleton-card"></div>
              <div class="skeleton-card"></div>
              <div class="skeleton-card"></div>
              <div class="skeleton-card"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initHome() {
  // Typing effect
  const fullText = "Hi, I'm bequiet";
  let i = 0;
  clearInterval(state.typingTimer);
  state.typingTimer = setInterval(() => {
    i++;
    const titleEl = document.getElementById('hero-title');
    if (!titleEl) { clearInterval(state.typingTimer); return; }
    const slice = fullText.slice(0, i);
    if (slice.length <= 8) {
      titleEl.innerHTML = `<span>${slice}</span><span class="cursor-blink">|</span>`;
    } else {
      titleEl.innerHTML = `<span>Hi, I'm </span><span class="neon-blue">${slice.slice(8)}</span><span class="cursor-blink">|</span>`;
    }
    if (i >= fullText.length) clearInterval(state.typingTimer);
  }, 120);

  // Fetch repos
  fetch('https://api.github.com/users/bqquiet/repos?sort=updated&per_page=4')
    .then(r => r.json())
    .then(data => {
      if (!Array.isArray(data)) return;
      const grid = document.getElementById('repos-grid');
      if (!grid) return;
      grid.innerHTML = data.map(repo => `
        <div class="repo-card" onclick="openRepoExplorer(${JSON.stringify(repo).replace(/"/g,'&quot;')})" data-id="${repo.id}">
          <div class="repo-name">${repo.name}</div>
          <div class="repo-desc">${repo.description || 'No description provided.'}</div>
          <div class="repo-meta">
            ${repo.language ? `<span><span class="lang-dot"></span> ${repo.language}</span>` : ''}
            <span style="display:flex;align-items:center;gap:.25rem;">${icon('star',14)} ${repo.stargazers_count}</span>
          </div>
          <a href="${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip"
             class="repo-dl-btn" title="Download ZIP" onclick="event.stopPropagation();playClick()">
            ${icon('download',16)}
          </a>
        </div>
      `).join('');
    })
    .catch(() => {
      const g = document.getElementById('repos-grid');
      if (g) g.innerHTML = `<p style="color:var(--text-muted);font-size:.875rem;grid-column:1/-1;text-align:center;">Could not load repositories.</p>`;
    });
}

window.openRepoExplorer = function(repo) {
  playClick();
  state.selectedRepo = repo;
  const panel = document.getElementById('repos-panel');
  if (!panel) return;
  panel.innerHTML = renderRepoExplorer(repo, '');
  fetchRepoContents(repo, '');
};

function renderRepoExplorer(repo, path) {
  const crumbs = path ? path.split('/') : [];
  return `
    <div style="display:flex;flex-direction:column;height:100%;">
      <div class="explorer-header">
        <button class="back-btn" onclick="closeRepoExplorer()" title="Back">${icon('chevron-left',16)}</button>
        <div class="breadcrumbs">
          <button class="breadcrumb-btn${path===''?' active':''}" onclick="fetchRepoContents(window._repo,'');playClick()">
            ${repo.name}
          </button>
          ${crumbs.map((c,i) => `
            <span class="breadcrumb-sep">/</span>
            <button class="breadcrumb-btn${i===crumbs.length-1?' active':''}"
              onclick="fetchRepoContents(window._repo,'${crumbs.slice(0,i+1).join('/')}');playClick()">
              ${c}
            </button>
          `).join('')}
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="gh-link" onclick="playClick()">
          View on GitHub ${icon('external-link',12)}
        </a>
      </div>
      <div class="explorer-body" id="explorer-body">
        <div style="display:flex;justify-content:center;padding:5rem;">
          ${icon('loader2',32,'spinner')}
        </div>
      </div>
    </div>
  `;
}

window._repo = null;
window.fetchRepoContents = function(repo, path) {
  window._repo = repo;
  const body = document.getElementById('explorer-body');
  if (!body) return;
  body.innerHTML = `<div style="display:flex;justify-content:center;padding:5rem;">${icon('loader2',32,'spinner')}</div>`;

  fetch(`https://api.github.com/repos/bqquiet/${repo.name}/contents/${path}`)
    .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
    .then(data => {
      if (!Array.isArray(data)) { body.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-muted)">Empty</p>'; return; }
      const sorted = data.sort((a,b) => a.type===b.type ? a.name.localeCompare(b.name) : a.type==='dir'?-1:1);
      body.innerHTML = sorted.map(item => {
        const isDir = item.type === 'dir';
        const size = item.size ? formatBytes(item.size) : '';
        return `
          <div class="file-row" onclick="${isDir ? `fetchRepoContents(window._repo,'${item.path}');playClick()` : `window.open('${item.html_url}','_blank');playClick()`}">
            <div style="display:flex;align-items:center;gap:.75rem;min-width:0;">
              <span class="${isDir?'file-icon-dir':'file-icon-file'}">${isDir?icon('folder',18):icon('file-text',18)}</span>
              <span class="file-name">${item.name}</span>
            </div>
            <div style="display:flex;align-items:center;gap:1rem;">
              ${!isDir ? `<span class="file-size">${size}</span>` : ''}
              <span class="file-arrow">${icon('arrow-up-right',14)}</span>
            </div>
          </div>
        `;
      }).join('');
    })
    .catch(err => {
      body.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--red-500);font-size:.875rem;">${icon('terminal',24)} ${err.message}</div>`;
    });
};

window.closeRepoExplorer = function() {
  playClick();
  state.selectedRepo = null;
  const panel = document.getElementById('repos-panel');
  if (!panel) return;
  // Re-render repos panel
  panel.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <div class="section-title">${icon('github',20)} ${t('home.recent')}</div>
      <a href="https://github.com/bqquiet" target="_blank" rel="noopener"
         style="font-size:.875rem;color:var(--text-muted);display:flex;align-items:center;gap:.25rem;transition:color .2s;"
         onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'"
         onclick="playClick()">
        GitHub ${icon('arrow-up-right',14)}
      </a>
    </div>
    <div class="repos-grid" id="repos-grid">
      <div class="skeleton-card"></div><div class="skeleton-card"></div>
      <div class="skeleton-card"></div><div class="skeleton-card"></div>
    </div>
  `;
  initHome(); // reload repos
};

function formatBytes(bytes) {
  if (!bytes) return '';
  const k = 1024, sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+sizes[i];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── NEWS PAGE ────────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageNews() {
  return `
    <div style="max-width:48rem;margin:0 auto;">
      <div class="page-header">
        <h1 class="page-title">${icon('sparkles',28,'',)} ${t('news.title')}</h1>
        <p class="page-sub">${t('news.sub')}</p>
      </div>
      <div class="tags-filter" id="tags-filter"></div>
      <div id="news-list">
        <div class="skeleton-card"></div>
        <div class="skeleton-card" style="margin-top:1rem;"></div>
        <div class="skeleton-card" style="margin-top:1rem;"></div>
      </div>
    </div>
  `;
}

let _allNews = [];

function initNews() {
  if (window._focusModeCleanup) window._focusModeCleanup();
  initFocusMode();

  Promise.all([
    fetch('/api/articles').then(r=>r.json()).catch(()=>[]),
    fetch('https://api.github.com/users/bqquiet/events/public').then(r=>r.json()).catch(()=>[])
  ]).then(([articles, ghEvents]) => {
    const dbArticles = Array.isArray(articles) ? articles : [];
    const ghItems = Array.isArray(ghEvents)
      ? ghEvents
          .filter(e => ['PushEvent','CreateEvent'].includes(e.type))
          .slice(0,5)
          .map(e => ({
            id:       `gh-${e.id}`,
            type:     'GitHub',
            title:    e.type==='PushEvent' ? `Pushed to ${e.repo.name}` : `Created ${e.repo.name}`,
            content:  e.type==='PushEvent' ? (e.payload.commits?.[0]?.message||'Commit pushed') : `New repo: ${e.repo.name}`,
            date:     new Date(e.created_at).toLocaleDateString(),
            link:     `https://github.com/${e.repo.name}`,
            isGithub: true,
            tags:     '#github #activity',
          }))
      : [];

    _allNews = [...dbArticles, ...ghItems].sort((a,b) => new Date(b.date)-new Date(a.date));
    state.newsFilter = null;
    renderNewsList();
  });
}

function renderNewsList() {
  const filtered = state.newsFilter
    ? _allNews.filter(n => n.tags?.toLowerCase().includes(state.newsFilter.toLowerCase()))
    : _allNews;

  const allTags = [...new Set(_allNews.flatMap(n => (n.tags||'').split(' ').filter(t=>t.startsWith('#'))))];

  const tagsEl = document.getElementById('tags-filter');
  if (tagsEl) {
    tagsEl.innerHTML = `
      <button class="tag-filter-btn${!state.newsFilter?' active':''}" onclick="setNewsFilter(null)">All</button>
      ${allTags.map(tag => `
        <button class="tag-filter-btn${state.newsFilter===tag?' active':''}" onclick="setNewsFilter('${tag}')">${tag}</button>
      `).join('')}
    `;
  }

  const listEl = document.getElementById('news-list');
  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state glass-card">
        ${icon('terminal',32)} <p style="margin-top:1rem;">${t('news.no_news')}</p>
      </div>`;
    return;
  }

  listEl.innerHTML = filtered.map((article, idx) => {
    const badgeClass = {
      'Telegram':'badge-telegram','GitHub':'badge-github',
      'Site Update':'badge-update','Blog':'badge-blog'
    }[article.type] || 'badge-blog';

    const badgeIcon = {
      'Telegram': icon('send',10),
      'GitHub': icon('github',10),
      'Site Update': icon('zap',10),
    }[article.type] || '';

    return `
      <div class="news-card glass-card" style="animation-delay:${idx*0.05}s"
           data-id="${article.id}" data-is-github="${article.isGithub||false}">
        <div class="news-card-header">
          <div style="display:flex;align-items:center;gap:.75rem;">
            <span class="news-badge ${badgeClass}">${badgeIcon} ${article.type}</span>
            <span class="news-date">${icon('clock',12)} ${article.date}</span>
          </div>
          <button class="news-share-btn" onclick="shareArticle(${JSON.stringify(article).replace(/"/g,'&quot;')})">${icon('share2',16)}</button>
        </div>
        <h2 class="news-title">${article.title}</h2>
        ${article.isGithub
          ? `<div class="news-code-block">${article.content}</div>`
          : `<div class="news-body">${article.content}</div>`
        }
        <div class="news-footer">
          <div class="news-tags">
            ${(article.tags||'').split(' ').filter(t=>t).map(tag=>`<span class="news-tag">${tag}</span>`).join('')}
          </div>
          ${article.link ? `
            <a href="${article.link}" target="_blank" rel="noopener" class="news-link" onclick="playClick()">
              ${article.isGithub ? t('news.view_gh') : t('news.read_more')} ${icon('arrow-up-right',14)}
            </a>` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Track views via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const id = card.dataset.id;
        const isGh = card.dataset.isGithub === 'true';
        if (!isGh && !isNaN(id)) {
          fetch(`/api/articles/${id}/view`, {method:'POST'}).catch(()=>{});
          observer.unobserve(card);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.news-card[data-is-github="false"]').forEach(c => observer.observe(c));
}

window.setNewsFilter = function(tag) {
  playClick();
  state.newsFilter = tag;
  renderNewsList();
};

window.shareArticle = function(article) {
  playClick();
  if (navigator.share) {
    navigator.share({
      title: article.title,
      text: (article.content||'').replace(/<[^>]*>/g,''),
      url: window.location.href
    }).catch(()=>{});
  } else {
    navigator.clipboard.writeText(window.location.href).catch(()=>{});
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── ABOUT PAGE ───────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageAbout() {
  const langs = ['Python','C/C++','HTML','CSS','SQL'];
  const tools = ['GIT','GITHUB','DOCKER','VSCODE'];
  return `
    <div style="max-width:56rem;margin:0 auto;">
      <div class="glass-card about-main">
        <h1 class="about-title">${t('about.title')}</h1>
        <p class="about-text">${t('about.p1')}</p>
        <p class="about-text">${t('about.p2')}</p>
        <p class="about-text">${t('about.p3')}</p>
      </div>

      <div class="about-grid">
        <div class="glass-card about-card">
          <h2 class="section-title" style="margin-bottom:1.5rem;">${icon('code2',20)} ${t('about.skills')}</h2>
          <div class="skills-group">
            <div class="skills-group-title">Languages</div>
            <div class="tech-tags">${langs.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
          </div>
          <div class="skills-group">
            <div class="skills-group-title">Frameworks & Tools</div>
            <div class="tech-tags">${tools.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
          </div>
        </div>

        <div class="glass-card about-card">
          <h2 class="section-title" style="margin-bottom:1.5rem;">${icon('briefcase',20)} ${t('about.exp')}</h2>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot active"></div>
              <div class="timeline-title">Software Engineering Student</div>
              <div class="timeline-sub">TNTU • Present</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot inactive"></div>
              <div class="timeline-title">Freelance Developer</div>
              <div class="timeline-sub">Self-Employed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── CONTACT PAGE ─────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageContact() {
  return `
    <div style="max-width:64rem;margin:0 auto;">
      <div style="text-align:center;margin-bottom:3rem;">
        <h1 style="font-size:2.25rem;font-weight:700;color:var(--text);margin-bottom:1rem;">${t('contact.title')}</h1>
        <p style="font-size:1.125rem;color:var(--text-muted);">${t('contact.sub')}</p>
      </div>

      <div class="contact-grid">
        ${[
          { icon:'mail',  label:'Email',    value:'dhdbcfdff@gmail.com', type:'email',    desc: t('contact.email_desc')    },
          { icon:'send',  label:'Telegram', value:'@bqquiet',            type:'telegram', desc: t('contact.telegram_desc') },
          { icon:'github',label:'GitHub',   value:'bqquiet',             type:'github',   desc: t('contact.github_desc')   },
        ].map(c => `
          <div class="glass-card contact-card">
            <div class="contact-icon-wrap">${icon(c.icon, 24)}</div>
            <div class="contact-label">${c.label}</div>
            <div class="contact-value">${c.value}</div>
            <div class="contact-desc">${c.desc}</div>
            <button class="copy-btn" id="copy-${c.type}" onclick="copyContact('${c.value}','${c.type}')">
              ${icon('copy',14)} ${t('contact.copy')}
            </button>
            <span class="check-badge" id="check-${c.type}" style="display:none;">${icon('check-circle2',20)}</span>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

window.copyContact = function(text, type) {
  playClick();
  navigator.clipboard.writeText(text).catch(()=>{});
  const btn = document.getElementById(`copy-${type}`);
  const check = document.getElementById(`check-${type}`);
  if (btn) btn.innerHTML = `${icon('check-circle2',14)} ${t('contact.copied')}`;
  if (check) check.style.display = 'flex';
  setTimeout(()=>{
    if (btn) btn.innerHTML = `${icon('copy',14)} ${t('contact.copy')}`;
    if (check) check.style.display = 'none';
  }, 2000);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── ADMIN PAGE ───────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageAdmin() {
  return `<div id="admin-root" class="admin-wrap">${state.adminAuth ? renderAdminDashboard() : renderAdminLogin()}</div>`;
}

function renderAdminLogin() {
  return `
    <div class="admin-login">
      <div class="admin-login-card">
        <div class="admin-login-icon">${icon('terminal',32)}</div>
        <h1 class="admin-login-title">Admin Access</h1>
        <p class="admin-login-sub">Enter your secret key to continue</p>
        <form id="admin-login-form">
          <input type="password" class="admin-input" id="admin-password" placeholder="••••••••" style="margin-bottom:1.5rem;text-align:center;font-size:1.5rem;letter-spacing:.5em;" />
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:1rem;border-radius:1rem;font-weight:700;font-size:1rem;" onclick="playClick()">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  `;
}

function renderAdminDashboard() {
  return `
    <div>
      <div class="admin-header">
        <div class="admin-title-group">
          <div class="admin-title-icon">${icon('sparkles',24)}</div>
          <div>
            <h1 class="admin-title">${t('admin.dashboard')}</h1>
            <p class="admin-sub">Manage your portfolio content and settings.</p>
          </div>
        </div>
        <div class="admin-header-btns">
          <button class="btn btn-outline" onclick="navigate('/');playClick()" style="gap:.5rem;display:flex;align-items:center;">
            ${icon('globe',18)} View Site
          </button>
          <button class="btn btn-outline" onclick="adminLogout()" style="color:var(--red-500);">
            Logout
          </button>
        </div>
      </div>

      <div class="admin-tabs">
        <button class="admin-tab${state.activeAdminTab==='news'?' active':''}" onclick="setAdminTab('news')">
          ${icon('newspaper',18)} News & Articles
        </button>
        <button class="admin-tab${state.activeAdminTab==='messages'?' active':''}" id="tab-messages" onclick="setAdminTab('messages')">
          ${icon('message-square',18)} Messages
        </button>
        <button class="admin-tab${state.activeAdminTab==='status'?' active':''}" onclick="setAdminTab('status')">
          ${icon('activity',18)} Current Status
        </button>
      </div>

      <div id="admin-tab-content"></div>
    </div>
  `;
}

function initAdmin() {
  if (!state.adminAuth) {
    const form = document.getElementById('admin-login-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const pw = document.getElementById('admin-password').value;
      if (pw === 'admin123') {
        state.adminAuth = true;
        document.getElementById('admin-root').innerHTML = renderAdminDashboard();
        loadAdminTab();
      } else {
        alert('Invalid password');
      }
    });
  } else {
    loadAdminTab();
  }
}

window.setAdminTab = function(tab) {
  playClick();
  state.activeAdminTab = tab;
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  event.currentTarget.classList.add('active');
  loadAdminTab();
};

let _adminArticles = [];
let _adminMessages = [];



function loadAdminTab() {
  const el = document.getElementById('admin-tab-content');
  if (!el) return;

  if (state.activeAdminTab === 'news') {
    el.innerHTML = renderAdminNews();
    initAdminNewsForm();
    fetchAdminArticles();
  } else if (state.activeAdminTab === 'messages') {
    el.innerHTML = renderAdminMessages();
    fetch('/api/messages', { headers: { 'Authorization': 'Bearer admin123' } })
      .then(r => r.json()).then(msgs => {
        _adminMessages = Array.isArray(msgs) ? msgs : [];
        renderAdminMessagesList();
        // update badge
        const badge = document.getElementById('tab-messages');
        if (badge && _adminMessages.length > 0) {
          badge.innerHTML = `${icon('message-square',18)} Messages <span style="background:rgba(255,255,255,.2);padding:.125rem .5rem;border-radius:9999px;font-size:.75rem;">${_adminMessages.length}</span>`;
        }
      }).catch(()=>{});
  } else if (state.activeAdminTab === 'status') {
    el.innerHTML = renderAdminStatus();
    initAdminStatus();
  }
}

function renderAdminNews() {
  return `
    <div class="admin-grid">
      <div class="admin-card admin-form">
        <div class="admin-form-title">${icon('plus',20,'',)} <span style="color:var(--blue-500);">${icon('plus',20)}</span> ${t('admin.new_entry')}</div>
        <div class="admin-field">
          <label class="admin-label">Entry Title</label>
          <input class="admin-input" id="a-title" type="text" placeholder="What's new?" value="${state.adminFormData.title}" />
        </div>
        <div class="admin-2col">
          <div>
            <label class="admin-label">Category</label>
            <select class="admin-input" id="a-type">
              ${['Blog','Site Update','Telegram','GitHub'].map(o=>`<option${state.adminFormData.type===o?' selected':''}>${o}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="admin-label">External Link</label>
            <input class="admin-input" id="a-link" type="text" placeholder="https://..." value="${state.adminFormData.link}" />
          </div>
        </div>
        <div class="admin-field">
          <label class="admin-label">Search Tags</label>
          <input class="admin-input" id="a-tags" type="text" placeholder="#react #typescript #update" value="${state.adminFormData.tags}" />
        </div>
        <div class="admin-field">
          <label class="admin-label">Content Editor</label>
          <div class="quill-wrap">
            <div id="quill-editor" style="height:20rem;"></div>
          </div>
        </div>
        <div class="admin-form-actions">
          <button class="btn btn-blue" style="flex:1;justify-content:center;padding:1rem;border-radius:1rem;font-weight:700;"
            id="btn-publish" onclick="submitAdminArticle(false)">
            ${t('admin.publish')}
          </button>
          <button class="btn-save-draft" onclick="submitAdminArticle(true)">
            ${t('admin.save_draft')}
          </button>
        </div>
      </div>

      <div class="admin-card admin-sidebar">
        <div class="admin-sidebar-title">
          ${icon('clock',20)} ${t('admin.manage')}
          <span class="articles-count" id="articles-count">0 Total</span>
        </div>
        <div class="articles-list" id="articles-list">
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
        </div>
      </div>
    </div>
  `;
}

function initAdminNewsForm() {
  // Init Quill
  if (typeof Quill !== 'undefined') {
    state.quill = new Quill('#quill-editor', { theme: 'snow' });
    if (state.adminFormData.content) state.quill.root.innerHTML = state.adminFormData.content;
  }
}

function fetchAdminArticles() {
  fetch('/api/articles?includeDrafts=true', { headers: { 'Authorization': 'Bearer admin123' } })
    .then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return;
      _adminArticles = data;
      const list = document.getElementById('articles-list');
      const count = document.getElementById('articles-count');
      if (count) count.textContent = `${data.length} Total`;
      if (!list) return;
      list.innerHTML = data.length === 0
        ? `<div style="text-align:center;padding:2.5rem;color:var(--text-muted);font-style:italic;font-size:.875rem;">No entries found.</div>`
        : data.map(a => `
            <div class="article-item">
              <div class="article-item-header">
                <span class="article-item-title" title="${a.title}">${a.title}</span>
                <button class="delete-btn" onclick="deleteAdminArticle(${a.id})">${icon('trash2',14)}</button>
              </div>
              <div class="article-item-meta">
                <div style="display:flex;align-items:center;gap:.5rem;">
                  ${a.is_draft ? `<span class="badge-draft">Draft</span>` : `<span class="badge-live">Live</span>`}
                  <span style="font-size:.625rem;color:var(--text-muted);display:flex;align-items:center;gap:.25rem;">${icon('activity',10)} ${a.views}</span>
                </div>
                <span class="article-date">${a.date}</span>
              </div>
            </div>
          `).join('');
    }).catch(()=>{});
}

window.submitAdminArticle = function(isDraft) {
  const title = document.getElementById('a-title')?.value;
  const type  = document.getElementById('a-type')?.value;
  const link  = document.getElementById('a-link')?.value;
  const tags  = document.getElementById('a-tags')?.value;
  const content = state.quill ? state.quill.root.innerHTML : '';

  if (!title || !content || content === '<p><br></p>') { alert('Title and content are required.'); return; }

  const date = new Date().toLocaleDateString('en-US', {day:'2-digit',month:'short',year:'numeric'});
  const btn = document.getElementById('btn-publish');
  if (!isDraft && btn) { btn.disabled = true; btn.innerHTML = `${icon('loader2',20,'spinner')} Publishing...`; }

  fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':'Bearer admin123' },
    body: JSON.stringify({ title, content, type, date, link, is_draft: isDraft, tags })
  }).then(r => {
    if (r.ok) {
      if (!isDraft) playSuccess(); else playClick();
      // Reset form
      if (document.getElementById('a-title')) document.getElementById('a-title').value = '';
      if (document.getElementById('a-link'))  document.getElementById('a-link').value  = '';
      if (document.getElementById('a-tags'))  document.getElementById('a-tags').value  = '';
      if (state.quill) state.quill.setContents([]);
      state.adminFormData = { title:'', content:'', type:'Blog', link:'', tags:'' };
      fetchAdminArticles();
      if (!isDraft && btn) { btn.disabled = false; btn.innerHTML = t('admin.publish'); }
    } else {
      alert('Error adding article');
      if (!isDraft && btn) { btn.disabled = false; btn.innerHTML = t('admin.publish'); }
    }
  }).catch(() => {
    if (!isDraft && btn) { btn.disabled = false; btn.innerHTML = t('admin.publish'); }
  });
};

window.deleteAdminArticle = function(id) {
  if (!confirm('Delete this article?')) return;
  playClick();
  fetch(`/api/articles/${id}`, {
    method:'DELETE',
    headers:{'Authorization':'Bearer admin123'}
  }).then(r => { if (r.ok) fetchAdminArticles(); }).catch(()=>{});
};

function renderAdminMessages() {
  return `
    <div class="admin-card admin-inbox">
      <div class="inbox-title">${icon('message-square',24,'',)} Inbox</div>
      <div id="messages-list">
        <div class="skeleton-card"></div>
      </div>
    </div>
  `;
}



function renderAdminMessagesList() {
  const el = document.getElementById('messages-list');
  if (!el) return;
  if (_adminMessages.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:3rem;display:flex;flex-direction:column;align-items:center;gap:1rem;">
        ${icon('message-square',48)}
        <p style="color:var(--text-muted);">No new messages.</p>
      </div>`;
    return;
  }
  el.innerHTML = _adminMessages.map(msg => `
    <div class="message-item">
      <div class="message-content">
        <div class="message-header">
          <div>
            <div class="message-name">${msg.name}</div>
            <a href="mailto:${msg.email}" class="message-email">${msg.email}</a>
          </div>
          <span class="message-date">${new Date(msg.date).toLocaleString()}</span>
        </div>
        <div class="message-body">${msg.message}</div>
      </div>
      <div class="message-actions">
        <a href="mailto:${msg.email}?subject=Re: Your message&body=%0A%0A---%0A${msg.name} wrote:%0A${encodeURIComponent(msg.message)}"
           class="msg-reply-btn" title="Reply">${icon('reply',18)}</a>
        <button class="msg-del-btn" onclick="deleteMessage(${msg.id})" title="Delete">${icon('trash2',18)}</button>
      </div>
    </div>
  `).join('');
}

window.deleteMessage = function(id) {
  if (!confirm('Delete this message?')) return;
  playClick();
  fetch(`/api/messages/${id}`, {
    method:'DELETE', headers:{'Authorization':'Bearer admin123'}
  }).then(r => {
    if (r.ok) {
      _adminMessages = _adminMessages.filter(m => m.id !== id);
      renderAdminMessagesList();
    }
  }).catch(()=>{});
};

function renderAdminStatus() {
  return `
    <div class="admin-card status-form">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;">
        ${icon('activity',24,'',)} <h2 style="font-size:1.5rem;font-weight:700;color:var(--text);">Currently Coding Status</h2>
      </div>
      <p style="color:var(--text-muted);margin-bottom:2rem;">Update the live status shown in the footer.</p>
      <form id="status-form">
        <div class="admin-field">
          <label class="admin-label">Project Name</label>
          <input class="admin-input" id="s-name" type="text" placeholder="e.g., portfolio-website" value="${state.statusData.name}" />
        </div>
        <div class="admin-2col">
          <div>
            <label class="admin-label">Language / Tech</label>
            <input class="admin-input" id="s-lang" type="text" placeholder="e.g., TypeScript" value="${state.statusData.language}" />
          </div>
          <div>
            <label class="admin-label">Editor</label>
            <input class="admin-input" id="s-editor" type="text" placeholder="e.g., VS Code" value="${state.statusData.editor}" />
          </div>
        </div>
        <div class="admin-field">
          <label class="admin-label">Current Activity</label>
          <select class="admin-input" id="s-status">
            ${['Coding','Debugging','Designing','Idle'].map(o=>`<option${state.statusData.status===o?' selected':''}>${o}</option>`).join('')}
          </select>
        </div>
        <button type="submit" class="btn btn-blue" style="width:100%;justify-content:center;padding:1rem;border-radius:1rem;font-weight:700;" id="btn-status">
          Update Live Status
        </button>
      </form>
    </div>
  `;
}

function initAdminStatus() {
  // Pre-fill from API
  fetch('/api/status').then(r=>r.json()).then(data => {
    if (data.currentProject) {
      const cp = data.currentProject;
      state.statusData = cp;
      const n = document.getElementById('s-name');
      const l = document.getElementById('s-lang');
      const e = document.getElementById('s-editor');
      const s = document.getElementById('s-status');
      if (n) n.value = cp.name || '';
      if (l) l.value = cp.language || '';
      if (e) e.value = cp.editor || '';
      if (s) s.value = cp.status || 'Coding';
    }
  }).catch(()=>{});

  const form = document.getElementById('status-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('btn-status');
    btn.disabled = true;
    btn.innerHTML = `${icon('loader2',20,'spinner')} Updating...`;
    const body = {
      name:     document.getElementById('s-name')?.value,
      language: document.getElementById('s-lang')?.value,
      editor:   document.getElementById('s-editor')?.value,
      status:   document.getElementById('s-status')?.value,
    };
    try {
      const res = await fetch('/api/status', {
        method:'PUT',
        headers:{'Content-Type':'application/json','Authorization':'Bearer admin123'},
        body: JSON.stringify(body)
      });
      if (res.ok) {
        playSuccess();
        state.statusData = body;
        btn.innerHTML = `${icon('check-circle2',20)} Updated!`;
        setTimeout(() => { btn.disabled = false; btn.innerHTML = 'Update Live Status'; }, 2000);
      }
    } catch(err) {
      btn.disabled = false;
      btn.innerHTML = 'Update Live Status';
    }
  });
}

window.adminLogout = function() {
  state.adminAuth = false;
  playClick();
  navigate('/');
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── 404 PAGE ─────────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function pageNotFound() {
  return `
    <div class="not-found">
      <div class="not-found-bg">404</div>
      <div class="not-found-content">
        <img
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop"
          alt="Cat"
          class="not-found-img"
        />
        <h1 class="not-found-title">ОКАК</h1>
        <a href="#/" class="btn-home" onclick="playClick()">НА ГОЛОВНУ</a>
      </div>
    </div>
  `;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── INIT ─────────────────────────────────────────────────────
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function init() {
  // Apply theme
  applyTheme(state.theme);

  // Render navbar & footer
  renderNavbar();
  renderFooter();

  // Live viewers
  renderLiveViewers();
  initSocket();

  // Back to top
  initBackToTop();

  // Secret admin trigger
  initSecretAdmin();

  // Route
  window.addEventListener('hashchange', () => router());
  router();

  // Hide loading screen after 2s
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    if (ls) { ls.style.opacity = '0'; setTimeout(()=>{ ls.style.display='none'; }, 500); }
    if (app) { app.classList.remove('hidden'); app.style.display = 'flex'; }
  }, 1800);
}

document.addEventListener('DOMContentLoaded', init);
