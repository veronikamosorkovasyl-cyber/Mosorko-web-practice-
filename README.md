# Cinema-Ua

Вебсайт кінотеатру з вибором місця на схемі залу. Навчальний проєкт з практики «WEB-технології та WEB-дизайн» (варіант 14).

> Сайт навчальний, не справжній.

**Автор:** Мосорко Вероніка, група 21-КН
**Викладач:** Кулик Р. М.

## Посилання

- Опублікований сайт: https://mosorko-web-practice.vercel.app
- Макет у Figma: https://www.figma.com/design/XHcTn6yepTD4zjSulpyGdn/Cinema
- API: https://mosorko-web-practice.onrender.com/

## Про проєкт

Cinema-Ua показує афішу фільмів, дає відфільтрувати її за кінотеатром, жанром і датою та обрати місця на інтерактивній схемі залу. Є форма звернення та повернення квитків, якщо сеанс скасовано через повітряну тривогу.

### Можливості

- Афіша на головній і каталог усіх фільмів з фільтрами та пошуком.
- Схема залу: 7 рядів по 11 місць, ряд 7 — VIP.
- Статуси місць: вільне, обране, зайняте, VIP (зайняті позначені штрихуванням, а не лише кольором).
- Підсумок замовлення: кількість квитків і сума в реальному часі (220 грн звичайне місце, 550 грн VIP).
- Форма контактів із валідацією на клієнті й на сервері.
- Світла й темна теми (системна або вручну, вибір зберігається).
- Адаптивна верстка mobile-first: 360, 768, 1280 px.
- Доступність: керування з клавіатури, видимий фокус, посилання «Перейти до основного вмісту».
- CRUD сеансів через REST API.

## Стек

| Частина | Технології |
| --- | --- |
| Розмітка і стилі | HTML5, CSS3 (Grid, Flexbox, custom properties) |
| Клієнт | JavaScript (ES-модулі), React, Vite, React Router |
| Сервер | Node.js, Express, `cors`, `dotenv` |
| Дані | JSON-файл (`fs/promises`) |
| Тести та аудит | Vitest, React Testing Library, Lighthouse, axe DevTools |
| Дизайн | Figma |
| Деплой | Vercel (клієнт), Render (сервер), автодеплой з гілки `main` |

## Скриншоти

| Головна | Вибір місця |
| --- | --- |
| ![Головна (<img width="1186" height="1024" alt="зображення" src="https://github.com/user-attachments/assets/6a5e5b10-267c-41b3-a20b-106ef04d0744" />
) | ![Вибір місця](<img width="1920" height="1200" alt="зображення" src="https://github.com/user-attachments/assets/21501a30-66cf-4120-82b1-6c6d47114040" />
) |

| Мобільна версія | Темна тема |
| --- | --- |
| ![Mobile](<img width="284" height="870" alt="зображення" src="https://github.com/user-attachments/assets/06278274-1f11-41a9-a3ed-732f18df0acf" />
) | ![Dark](<img width="272" height="886" alt="зображення" src="https://github.com/user-attachments/assets/430847a6-3500-42f0-8c11-e8eec7e640f8" />
) |

## Запуск локально

Потрібен Node.js 18 або новіший.

```bash
git clone https://github.com/veronikamosorkovasyl-cyber/Mosorko-web-practice-.git
cd Mosorko-web-practice-
```

### Сервер

```bash
cd server
npm install
cp .env.example .env
npm start
```

Змінні в `server/.env`:

```
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
DATA_FILE=./data/items.json
ADMIN_TOKEN=change-me
```

### Клієнт

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Змінна в `client/.env`:

```
VITE_API_URL=http://localhost:3000
```

Сайт відкриється на http://localhost:5173.

### Тести

```bash
cd client
npm test
```

## API

Повний опис у [docs/API.md](docs/API.md).

| Метод | URL | Коди відповідей |
| --- | --- | --- |
| GET | `/api/items` | 200 |
| GET | `/api/items/:id` | 200, 404 |
| POST | `/api/items` | 201, 400 |
| PUT | `/api/items/:id` | 200, 400, 404 |
| DELETE | `/api/items/:id` | 204, 404 |
| POST | `/api/contact` | 201, 400 |

## Структура репозиторію

```
mosorko-web-practice/
├─ README.md
├─ LICENSE
├─ .gitignore
├─ docs/
│  ├─ TZ.md          технічне завдання
│  ├─ UX.md          персони, user stories, дизайн-система
│  ├─ AI.md          використання AI-асистентів
│  ├─ API.md         опис ендпоінтів
│  ├─ AUDIT.md       Lighthouse, чек-лист тестів
│  ├─ report.pdf     звіт з практики
│  └─ cinema-api.postman_collection.json
├─ client/
│  ├─ static/        HTML-сторінки (ПР 4)
│  ├─ public/        логотип, іконки, постери
│  └─ src/           React-застосунок
└─ server/
   ├─ data/items.json
   └─ src/           Express API
```

## Результати

Lighthouse (mobile), головна сторінка:

| Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- |
| 100 | 100 | 96 | 100 |

LCP 1,5 с, CLS 0,015, INP 0. Деталі в [docs/AUDIT.md](docs/AUDIT.md).

## Робота з Git

Гілка на кожну практичну роботу, Pull Request у `main`, теги `pr-01` … `pr-10`. Повідомлення комітів за Conventional Commits: `feat:`, `fix:`, `docs:`. Реліз: `v1.0.0`.

## Ліцензія

MIT, див. [LICENSE](LICENSE).
