import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Github, Send, Mail, MapPin, Briefcase, Code2, Terminal, ArrowUpRight, Plus, Trash2, GitCommit, Star, GitFork, ExternalLink, Menu, X, Loader2, Folder, File, ChevronLeft, FileText, Zap, Clock, Sparkles, Download, Share2, ArrowUp, Copy, CheckCircle2, Activity, Globe, MessageSquare, Newspaper, Settings, Reply } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import useSound from 'use-sound';

// i18n resources
const resources = {
  en: {
    translation: {
      nav: { home: 'Home', news: 'News', about: 'About', contact: 'Contact' },
      home: { 
        greeting: "Hi, I'm", 
        role: "Software Engineering Student & Freelancer",
        sub: "I'm a first-year Software Engineering student and freelancer. I build clean, efficient, and elegant software solutions without unnecessary noise.",
        recent: "Recent Activity",
        view_all: "View all",
        download: "Download ZIP",
        stack: "Tech Stack",
        stack_sub: "The tools I use daily."
      },
      about: {
        title: "About Me",
        p1: "I'm a first-year Software Engineering student at TNTU. My approach to development is simple: code should be clean, logical, and quiet. I don't like unnecessary complexity or 'noise' in architecture.",
        p2: "I started my journey with automation scripts and bots, and now I'm diving deep into full-stack development and system engineering. I'm always looking for the most efficient way to solve a problem, often suggesting simplifications that save time and resources.",
        p3: "When I'm not coding, I'm likely exploring new technologies or working on freelance projects. I value transparency, precision, and high-quality results.",
        skills: "Technical Skills",
        exp: "Experience & Education"
      },
      news: {
        title: "News & Updates",
        sub: "The latest articles, project updates, and GitHub activity.",
        read_more: "Read more",
        view_gh: "View on GitHub",
        no_news: "No updates published yet."
      },
      contact: {
        title: "Get in Touch",
        sub: "Have a project in mind or just want to say hi? Feel free to reach out.",
        copy: "Copy",
        copied: "Copied!",
        email_desc: "Drop me an email for business inquiries.",
        github_desc: "Check out my repositories and contributions.",
        telegram_desc: "Fastest way to reach me directly."
      },
      admin: {
        dashboard: "Admin Dashboard",
        new_entry: "New Entry",
        publish: "Publish Entry",
        save_draft: "Save Draft",
        manage: "Manage Entries",
        views: "views"
      }
    }
  },
  ua: {
    translation: {
      nav: { home: 'Головна', news: 'Новини', about: 'Про мене', contact: 'Контакти' },
      home: { 
        greeting: "Привіт, я", 
        role: "Студент ПЗ та Фрілансер",
        sub: "Я студент першого курсу спеціальності 'Інженерія програмного забезпечення' та фрілансер. Створюю чисті, ефективні та елегантні програмні рішення без зайвого шуму.",
        recent: "Остання активність",
        view_all: "Дивитись всі",
        download: "Завантажити ZIP",
        stack: "Стек технологій",
        stack_sub: "Інструменти, які я використовую щодня."
      },
      about: {
        title: "Про мене",
        p1: "Я студент першого курсу спеціальності 'Інженерія програмного забезпечення' в ТНТУ. Мій підхід до розробки простий: код має бути чистим, логічним і 'тихим'. Я не люблю зайвої складності або 'шуму' в архітектурі.",
        p2: "Мій шлях почався з скриптів автоматизації та ботів, а зараз я заглиблююсь у full-stack розробку та системну інженерію. Я завжди шукаю найефективніший спосіб вирішення задачі, часто пропонуючи спрощення, які економлять час та ресурси.",
        p3: "Коли я не програмую, я, швидше за все, вивчаю нові технології або працюю над фріланс-проектами. Я ціную прозорість, точність і високу якість результату.",
        skills: "Технічні навички",
        exp: "Досвід та освіта"
      },
      news: {
        title: "Новини та оновлення",
        sub: "Останні статті, оновлення проектів та активність на GitHub.",
        read_more: "Читати далі",
        view_gh: "Дивитись на GitHub",
        no_news: "Оновлень поки немає."
      },
      contact: {
        title: "Зв'яжіться зі мною",
        sub: "Маєте проект або просто хочете привітатися? Пишіть мені.",
        copy: "Копіювати",
        copied: "Скопійовано!",
        email_desc: "Напишіть мені на пошту для ділових пропозицій.",
        github_desc: "Перегляньте мої репозиторії та внески.",
        telegram_desc: "Найшвидший спосіб зв'язатися зі мною напряму."
      },
      admin: {
        dashboard: "Панель адміна",
        new_entry: "Новий запис",
        publish: "Опублікувати",
        save_draft: "В чернетки",
        manage: "Керування",
        views: "переглядів"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: { escapeValue: false }
});

// Utility for tailwind classes
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Theme Context
type Theme = 'dark' | 'light';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Secret Admin Hook
const useSecretAdmin = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keysRef = useRef('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      keysRef.current += e.key.toLowerCase();
      if (keysRef.current.length > 7) keysRef.current = keysRef.current.slice(-7);
      
      if (keysRef.current === 'bequiet') {
        navigate('/admin');
        keysRef.current = '';
      }

      timeoutRef.current = setTimeout(() => {
        keysRef.current = '';
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigate]);
};

// Navigation Component
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.25 });

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.news'), path: '/news' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    playClick();
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 navbar-hide transition-transform duration-500">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" onClick={playClick} className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Terminal size={20} className="text-blue-500 group-hover:text-blue-400 transition-colors" />
          </motion.div>
          bequiet<span className="text-blue-500">.</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={playClick}
              className={cn(
                "text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-white",
                location.pathname === link.path 
                  ? "text-zinc-900 dark:text-white" 
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-200 dark:border-zinc-800">
            <button 
              onClick={() => changeLanguage('en')}
              className={cn("lang-btn", i18n.language === 'en' && "lang-btn-active")}
            >
              EN
            </button>
            <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-800 mx-0.5" />
            <button 
              onClick={() => changeLanguage('ua')}
              className={cn("lang-btn", i18n.language === 'ua' && "lang-btn-active")}
            >
              UA
            </button>
          </div>

          <button 
            onClick={() => { toggleTheme(); playClick(); }}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-500 hover:rotate-12"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className="md:hidden p-2 text-zinc-500 dark:text-zinc-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => { setIsMenuOpen(false); playClick(); }}
                  className={cn(
                    "text-sm font-medium",
                    location.pathname === link.path ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Back to Top Component
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.2 });

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button 
      onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); playClick(); }}
      className="back-to-top"
    >
      <ArrowUp size={20} className="text-blue-500" />
    </button>
  );
};

// Footer Component with Health Check and Current Project
const Footer = () => {
  const [status, setStatus] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(setStatus)
      .catch(console.error);
  }, []);

  return (
    <footer className="py-12 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm hide-on-focus">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Status</h4>
            <div className="space-y-2">
              {status?.services.map((s: any) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <div className={cn("status-dot", s.status === 'online' ? "status-online" : "status-offline")} />
                    {s.name}
                  </span>
                  <span className="font-mono text-zinc-400">{s.latency}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Current Activity (VS Code)</h4>
            {status?.currentProject ? (
              <div className="glass-card p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-1">
                  <Activity size={12} /> Coding Now
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-white">{status.currentProject.name}</div>
                <div className="text-xs text-zinc-500">{status.currentProject.language}</div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Not coding right now.</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/bqquiet" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><Mail size={20} /></a>
              <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><Send size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-8 border-t border-zinc-200 dark:border-zinc-800 gap-4">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} bequiet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/news') {
        setIsFocusMode(window.scrollY > 200);
      } else {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useSecretAdmin();

  return (
    <div className={cn("min-h-screen bg-mesh transition-colors duration-500 flex flex-col", isFocusMode && "focus-mode-active")}>
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

// --- Components ---

const RepoExplorer = ({ repo, onBack }: { repo: any, onBack: () => void }) => {
  const [contents, setContents] = useState<any[]>([]);
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.25 });

  const fetchContents = (currentPath: string) => {
    setLoading(true);
    setError(null);
    const url = `https://api.github.com/repos/bqquiet/${repo.name}/contents/${currentPath}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch contents');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
          });
          setContents(sorted);
        } else {
          setContents([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContents(path);
  }, [path, repo.name]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const breadcrumbs = path === '' ? [] : path.split('/');

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <button 
          onClick={() => { onBack(); playClick(); }}
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title="Back to repositories"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1 font-mono text-zinc-500 dark:text-zinc-400 overflow-hidden">
          <button 
            onClick={() => { setPath(''); playClick(); }}
            className={cn("hover:text-blue-500 transition-colors", path === '' ? "text-zinc-900 dark:text-white font-bold" : "")}
          >
            {repo.name}
          </button>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <button 
                onClick={() => { setPath(breadcrumbs.slice(0, i + 1).join('/')); playClick(); }}
                className={cn(
                  "hover:text-blue-500 transition-colors truncate max-w-[100px]",
                  i === breadcrumbs.length - 1 ? "text-zinc-900 dark:text-white font-bold" : ""
                )}
              >
                {crumb}
              </button>
            </React.Fragment>
          ))}
        </div>

        <a 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={() => playClick()}
          className="ml-auto text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          View on GitHub <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm flex flex-col items-center gap-2">
            <Terminal size={24} className="opacity-50" />
            {error}
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">Empty directory</div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {contents.map((item) => (
              <div 
                key={item.sha}
                onClick={() => {
                  playClick();
                  item.type === 'dir' ? setPath(item.path) : window.open(item.html_url, '_blank');
                }}
                className="flex items-center justify-between p-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.type === 'dir' ? (
                    <Folder size={18} className="text-blue-500 fill-blue-500/10 flex-shrink-0" />
                  ) : (
                    <FileText size={18} className="text-zinc-400 flex-shrink-0" />
                  )}
                  <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate group-hover:text-blue-500 transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                  {item.type === 'file' && <span>{formatSize(item.size)}</span>}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Pages ---

const Home = () => {
  const { t } = useTranslation();
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [typedText, setTypedText] = useState('');
  const fullText = "Hi, I'm bequiet";
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.25 });

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTypedText(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/bqquiet/repos?sort=updated&per_page=4')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(err => console.error("Failed to fetch GitHub repos", err));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full p-1 border-neon avatar-glow overflow-hidden flex-shrink-0 group">
          <img 
            src="https://github.com/bqquiet.png" 
            alt="Andrii BAKALEIKO" 
            className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 min-h-[2.5rem] md:min-h-[3rem]">
            {typedText.length <= 8 ? (
              <span>{typedText}</span>
            ) : (
              <>
                <span>Hi, I'm </span>
                <span className="text-neon-blue">{typedText.slice(8)}</span>
              </>
            )}
            <span className="cursor-blink font-light text-zinc-400 dark:text-zinc-600">|</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-6 max-w-2xl leading-relaxed">
            {t('home.role')}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-xl">
            {t('home.sub')}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link to="/about" onClick={playClick} className="px-6 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-glow">
              {t('nav.about')}
            </Link>
            <Link to="/contact" onClick={playClick} className="px-6 py-3 rounded-xl bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all btn-glow">
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tech Stack */}
        <div className="md:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
              <Code2 size={20} /> {t('home.stack')}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{t('home.stack_sub')}</p>
            <div className="flex flex-wrap gap-2">
              {['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'Tailwind CSS', 'HTML/CSS', 'SQLite', 'Vite', 'Git', 'GitHub', 'C/C++', 'PostgreSQL', 'Docker'].map(tech => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 text-xs font-mono border border-zinc-200 dark:border-zinc-700/50 tech-pulse cursor-default transition-all duration-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="md:col-span-8 glass-card rounded-3xl p-6">
          <AnimatePresence mode="wait">
            {selectedRepo ? (
              <motion.div
                key="explorer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <RepoExplorer repo={selectedRepo} onBack={() => setSelectedRepo(null)} />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Github size={20} /> Recent Activity
                  </h3>
                  <a href="https://github.com/bqquiet" target="_blank" rel="noopener noreferrer" onClick={() => playClick()} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    GitHub <ArrowUpRight size={14} />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {repos.length > 0 ? repos.map((repo) => (
                    <div key={repo.id} className="relative group">
                      <button 
                        onClick={() => { setSelectedRepo(repo); playClick(); }}
                        className="w-full text-left block p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                      >
                        <h4 className="font-bold text-zinc-900 dark:text-white truncate mb-2 group-hover:text-blue-500 transition-colors">
                          {repo.name}
                        </h4>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 h-10">
                          {repo.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1"><Star size={14} /> {repo.stargazers_count}</span>
                        </div>
                      </button>
                      <a 
                        href={`${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`}
                        onClick={() => playClick()}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Download as ZIP"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center py-4 text-zinc-500 text-sm">Loading repositories...</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const News = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [githubEvents, setGithubEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.25 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, githubRes] = await Promise.all([
          fetch('/api/articles'),
          fetch('https://api.github.com/users/bqquiet/events/public')
        ]);

        const articlesData = await articlesRes.json();
        const githubData = await githubRes.json();

        if (Array.isArray(articlesData)) setArticles(articlesData);
        if (Array.isArray(githubData)) {
          const events = githubData
            .filter(e => ['PushEvent', 'CreateEvent'].includes(e.type))
            .slice(0, 5)
            .map(e => ({
              id: `gh-${e.id}`,
              type: 'GitHub',
              title: e.type === 'PushEvent' ? `Pushed to ${e.repo.name}` : `Created ${e.repo.name}`,
              content: e.type === 'PushEvent' 
                ? e.payload.commits?.[0]?.message || 'Commit pushed' 
                : `New repository created: ${e.repo.name}`,
              date: new Date(e.created_at).toLocaleDateString(),
              link: `https://github.com/${e.repo.name}`,
              isGithub: true,
              tags: '#github #activity'
            }));
          setGithubEvents(events);
        }
      } catch (err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = async (id: number) => {
    fetch(`/api/articles/${id}/view`, { method: 'POST' }).catch(console.error);
  };

  const handleShare = (article: any) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.content.replace(/<[^>]*>/g, ''),
        url: window.location.href
      }).catch(console.error);
    }
  };

  const allNews = [...articles, ...githubEvents].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredNews = filter 
    ? allNews.filter(n => n.tags?.toLowerCase().includes(filter.toLowerCase()))
    : allNews;

  const allTags = Array.from(new Set(allNews.flatMap(n => n.tags?.split(' ').filter(t => t.startsWith('#')) || [])));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-blue-500" /> {t('news.title')}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{t('news.sub')}</p>
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button 
          onClick={() => { setFilter(null); playClick(); }}
          className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", !filter ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500")}
        >
          All
        </button>
        {allTags.map(tag => (
          <button 
            key={tag}
            onClick={() => { setFilter(tag); playClick(); }}
            className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", filter === tag ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500")}
          >
            {tag}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800/50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="space-y-6">
          {filteredNews.map((article) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={article.id} 
              onViewportEnter={() => !article.isGithub && handleView(article.id)}
              className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1",
                    article.type === 'Telegram' ? "bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]" : 
                    article.type === 'GitHub' ? "bg-zinc-800 shadow-[0_0_15px_rgba(39,39,42,0.5)]" : 
                    article.type === 'Site Update' ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : 
                    article.type === 'Blog' ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-blue-500"
                  )}>
                    {article.type === 'Site Update' && <Zap size={10} className="fill-white" />}
                    {article.type === 'GitHub' && <Github size={10} className="fill-white" />}
                    {article.type === 'Telegram' && <Send size={10} className="fill-white" />}
                    {article.type}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Clock size={12} /> {article.date}
                  </span>
                </div>
                <button 
                  onClick={() => { handleShare(article); playClick(); }}
                  className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                >
                  <Share2 size={16} />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">{article.title}</h2>
              
              {article.isGithub ? (
                <p className="text-zinc-600 dark:text-zinc-300 mb-4 font-mono text-sm bg-zinc-100 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {article.content}
                </p>
              ) : (
                <div 
                  className="news-content mb-4"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex gap-2">
                  {article.tags?.split(' ').map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-zinc-400">{tag}</span>
                  ))}
                </div>
                {article.link && (
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium inline-flex items-center gap-1">
                    {article.isGithub ? t('news.view_gh') : t('news.read_more')} <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-card rounded-3xl text-zinc-500 dark:text-zinc-400">
          <Terminal className="mx-auto mb-4 opacity-50" size={32} />
          <p>{t('news.no_news')}</p>
        </div>
      )}
    </div>
  );
};

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6">{t('about.title')}</h1>
        <div className="space-y-6 text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Code2 size={20} /> {t('about.skills')}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wider">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'JavaScript', 'TypeScript', 'C/C++', 'HTML/CSS', 'SQL', 'Java', 'C#'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 text-xs font-mono border border-zinc-200 dark:border-zinc-700/50 tech-pulse transition-all duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wider">Frameworks & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'Express', 'Tailwind CSS', 'Vite', 'SQLite', 'Git', 'GitHub', 'PostgreSQL', 'Docker', 'Linux', 'Nginx'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 text-xs font-mono border border-zinc-200 dark:border-zinc-700/50 tech-pulse transition-all duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase size={20} /> {t('about.exp')}
          </h2>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800">
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-zinc-50 dark:ring-zinc-950"></div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Software Engineering Student</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">TNTU • Present</p>
            </div>
            <div className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800">
              <div className="absolute w-3 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full -left-[7px] top-1.5 ring-4 ring-zinc-50 dark:ring-zinc-950"></div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Freelance Developer</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Self-Employed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.25 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', { volume: 0.25 });
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    playClick();
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        playSuccess();
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contacts = [
    { icon: <Mail />, label: 'Email', value: 'dhdbcfdff@gmail.com', type: 'email', desc: t('contact.email_desc') },
    { icon: <Send />, label: 'Telegram', value: '@bqquiet', type: 'telegram', desc: t('contact.telegram_desc') },
    { icon: <Github />, label: 'GitHub', value: 'bqquiet', type: 'github', desc: t('contact.github_desc') }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">{t('contact.title')}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('contact.sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contacts.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-8 flex flex-col items-center text-center group relative overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-500 group-hover:text-white group-hover:bg-blue-500 group-hover:-translate-y-4 group-hover:scale-110 group-hover:shadow-[0_15px_30px_rgba(59,130,246,0.4)] transition-all duration-300 ease-out">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{item.label}</h3>
            <p className="text-zinc-900 dark:text-white font-mono mb-2">{item.value}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{item.desc}</p>
            
            <button 
              onClick={() => copyToClipboard(item.value, item.type)}
              className="mt-auto px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2"
            >
              {copied === item.type ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied === item.type ? t('contact.copied') : t('contact.copy')}
            </button>

            {copied === item.type && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 text-emerald-500"
              >
                <CheckCircle2 size={20} />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Send a Message</h2>
          <p className="text-zinc-500">I'll get back to you as soon as possible.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Message</label>
            <textarea 
              required
              rows={4}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              placeholder="How can I help you?"
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 btn-glow flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : submitStatus === 'success' ? <><CheckCircle2 size={20} /> Sent Successfully!</> : <><Send size={20} /> Send Message</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'messages' | 'status'>('news');
  
  const [articles, setArticles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [statusData, setStatusData] = useState({ name: '', language: '', editor: '', status: '' });
  
  const [formData, setFormData] = useState({ title: '', content: '', type: 'Blog', link: '', tags: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.25 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', { volume: 0.25 });

  const fetchArticles = () => {
    fetch('/api/articles?includeDrafts=true', {
      headers: { 'Authorization': 'Bearer admin123' }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data);
      });
  };

  const fetchMessages = () => {
    fetch('/api/messages', {
      headers: { 'Authorization': 'Bearer admin123' }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
      });
  };

  const fetchStatus = () => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        if (data.currentProject) setStatusData(data.currentProject);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchArticles();
      fetchMessages();
      fetchStatus();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    setIsSubmitting(true);
    const date = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify({ ...formData, date, is_draft: isDraft })
      });
      
      if (res.ok) {
        setFormData({ title: '', content: '', type: 'Blog', link: '', tags: '' });
        fetchArticles();
      } else {
        alert('Error adding article');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin123' }
      });
      if (res.ok) fetchArticles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin123' }
      });
      if (res.ok) fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin123'
        },
        body: JSON.stringify(statusData)
      });
      if (res.ok) {
        playSuccess();
        alert('Status updated successfully!');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card p-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <Terminal size={32} className="text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Admin Access</h1>
            <p className="text-zinc-500 text-sm mt-2">Enter your secret key to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="admin-input text-center text-2xl tracking-[0.5em]"
            />
            <button 
              onClick={() => playClick()}
              type="submit" 
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/10"
            >
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{t('admin.dashboard')}</h1>
            <p className="text-zinc-500 text-sm">Manage your portfolio content and settings.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { playClick(); navigate('/'); }}
            className="px-6 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-2"
          >
            <Globe size={18} /> View Site
          </button>
          <button 
            onClick={() => { setIsAuthenticated(false); navigate('/'); playClick(); }} 
            className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-red-500 bg-zinc-100 dark:bg-zinc-800 rounded-xl transition-all hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={() => setActiveTab('news')}
          className={cn("px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2", activeTab === 'news' ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700")}
        >
          <Newspaper size={18} /> News & Articles
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={cn("px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2", activeTab === 'messages' ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700")}
        >
          <MessageSquare size={18} /> Messages
          {messages.length > 0 && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{messages.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('status')}
          className={cn("px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2", activeTab === 'status' ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700")}
        >
          <Activity size={18} /> Current Status
        </button>
      </div>

      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="admin-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <Plus size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t('admin.new_entry')}</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Entry Title</label>
                  <input 
                    type="text" 
                    placeholder="What's new?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="admin-input"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Category</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="admin-input appearance-none"
                    >
                      <option>Blog</option>
                      <option>Site Update</option>
                      <option>Telegram</option>
                      <option>GitHub</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">External Link</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Search Tags</label>
                  <input 
                    type="text" 
                    placeholder="#react #typescript #update"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Content Editor</label>
                  <div className="bg-white dark:bg-zinc-950 rounded-[1.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <ReactQuill 
                      theme="snow" 
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      className="h-80 mb-12"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    onClick={() => { handleSubmit(false); playSuccess(); }}
                    disabled={isSubmitting}
                    className="flex-grow py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 btn-glow"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : t('admin.publish')}
                  </button>
                  <button 
                    onClick={() => { handleSubmit(true); playClick(); }}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 transition-all"
                  >
                    {t('admin.save_draft')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="admin-card p-8 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-zinc-400" />
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t('admin.manage')}</h2>
                </div>
                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {articles.length} Total
                </span>
              </div>
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                {articles.map((article) => (
                  <motion.div 
                    layout
                    key={article.id} 
                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 group hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-500 transition-colors">{article.title}</h4>
                      <button 
                        onClick={() => { handleDelete(article.id); playClick(); }} 
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <div className="flex items-center gap-2">
                        {article.is_draft ? (
                          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded font-bold uppercase tracking-tighter">Draft</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-bold uppercase tracking-tighter">Live</span>
                        )}
                        <span className="flex items-center gap-1 opacity-60">
                          <Activity size={10} /> {article.views}
                        </span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                  </motion.div>
                ))}
                {articles.length === 0 && (
                  <div className="text-center py-10 text-zinc-500 text-sm italic">
                    No entries found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="admin-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare size={24} className="text-blue-500" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Inbox</h2>
          </div>
          <div className="space-y-4">
            {messages.length > 0 ? messages.map(msg => (
              <div key={msg.id} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-6 justify-between group">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="text-sm text-blue-500 hover:underline">{msg.email}</a>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{new Date(msg.date).toLocaleString()}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 self-start opacity-0 group-hover:opacity-100 transition-all">
                  <a 
                    href={`mailto:${msg.email}?subject=Re: Your message on bequiet portfolio&body=%0A%0A---%0AOn ${new Date(msg.date).toLocaleString()}, ${msg.name} wrote:%0A${encodeURIComponent(msg.message)}`}
                    className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                    title="Reply via Email"
                  >
                    <Reply size={18} />
                  </a>
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <MessageSquare size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
                <p className="text-zinc-500">No new messages.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="admin-card p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Activity size={24} className="text-blue-500" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Currently Coding Status</h2>
          </div>
          <p className="text-zinc-500 mb-8">Update the live status shown on the homepage to let visitors know what you're working on.</p>
          
          <form onSubmit={handleUpdateStatus} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Project Name</label>
              <input 
                type="text" 
                value={statusData.name}
                onChange={e => setStatusData({...statusData, name: e.target.value})}
                className="admin-input"
                placeholder="e.g., portfolio-website"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Language / Tech</label>
                <input 
                  type="text" 
                  value={statusData.language}
                  onChange={e => setStatusData({...statusData, language: e.target.value})}
                  className="admin-input"
                  placeholder="e.g., TypeScript"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Editor</label>
                <input 
                  type="text" 
                  value={statusData.editor}
                  onChange={e => setStatusData({...statusData, editor: e.target.value})}
                  className="admin-input"
                  placeholder="e.g., VS Code"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Activity</label>
              <select 
                value={statusData.status}
                onChange={e => setStatusData({...statusData, status: e.target.value})}
                className="admin-input"
              >
                <option value="Coding">Coding</option>
                <option value="Debugging">Debugging</option>
                <option value="Designing">Designing</option>
                <option value="Idle">Idle</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 btn-glow"
            >
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Update Live Status'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-zinc-900 dark:text-white relative overflow-hidden font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-zinc-200 dark:text-zinc-800/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
          404
        </div>
        
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
          <img 
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop" 
            alt="Cat" 
            className="w-full h-full object-cover rounded-full border-4 border-zinc-200 dark:border-zinc-800 shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">ОКАК</h1>
        
        <Link 
          to="/" 
          className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95"
        >
          НА ГОЛОВНУ
        </Link>
      </motion.div>
    </div>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <Terminal size={48} className="text-blue-500 animate-pulse" />
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-mono text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Initializing system...</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <Router>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
          ) : (
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          )}
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}
