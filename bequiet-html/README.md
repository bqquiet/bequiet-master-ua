# bequiet. — Vanilla HTML/CSS/JS

Повністю переписаний портфоліо-сайт з React/TypeScript на чистий **HTML + CSS + JavaScript** зі збереженням усього функціоналу.

## Що змінилось

| Було (TypeScript/React)       | Стало (Vanilla)                          |
|-------------------------------|------------------------------------------|
| `React` + JSX                 | Чистий DOM manipulation                  |
| `react-router-dom`            | Hash-роутер (`location.hash`)            |
| `framer-motion` (animations)  | CSS `@keyframes` + transitions           |
| `tailwindcss`                 | Чистий CSS з CSS Variables               |
| `i18next`                     | Свій простий об'єкт перекладів           |
| `react-quill-new`             | Quill.js через CDN                       |
| `use-sound`                   | `new Audio()` нативно                    |
| `socket.io-client` npm        | Socket.io через CDN                      |
| `server.ts` + Vite            | `server.js` (CommonJS) + express static  |
| `tsconfig`, `vite.config`     | Не потрібні                              |

## Структура

```
bequiet-html/
├── index.html        # HTML оболонка SPA
├── style.css         # Всі стилі (CSS Variables, анімації)
├── app.js            # Весь фронтенд (роутер, сторінки, логіка)
├── server.js         # Express + Socket.io + SQLite (CommonJS)
├── package.json
└── node_modules/
```

## Запуск

```bash
npm install
npm start
# → http://localhost:3000
```

## Функціонал (збережено повністю)

- ✅ SPA з hash-роутером (`/`, `/news`, `/about`, `/contact`, `/admin`)
- ✅ Темна/світла тема (localStorage)
- ✅ Перемикач мови EN/UA
- ✅ Typing-ефект на головній
- ✅ GitHub repo explorer (browse файли прямо на сайті)
- ✅ Новини з фільтрацією по тегах
- ✅ GitHub Events інтеграція
- ✅ Лічильник переглядів статей
- ✅ Контактна форма → SQLite
- ✅ Live viewers (Socket.io)
- ✅ Секретний адмін-доступ (набрати `bequiet` на клавіатурі)
- ✅ Адмін-панель: новини, повідомлення, VS Code статус
- ✅ Quill WYSIWYG редактор в адмінці
- ✅ Focus Mode (ховає navbar під час читання новин)
- ✅ Back to Top кнопка
- ✅ Footer зі статусами API та поточним проектом
- ✅ 404 сторінка з котиком
- ✅ Звукові ефекти при кліках

## Порти та змінні

```env
PORT=3000          # можна змінити через env
```

Адмін-пароль: `admin123` (або набрати `bequiet` на клавіатурі для переходу на /admin)
