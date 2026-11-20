# API-документація — Cinema-Ua


> API описано за планом з ТЗ/README. Точні схеми payload, middleware та поведінка сервера не були незалежно перевірені через недоступність вихідних файлів у цьому сеансі. Перед здачею звірити цей документ з `server/src`.


## 1. Базова URL
- Local: `http://localhost:3000`
- Deployed (README): `https://mosorko-web-practice.onrender.com`
- JSON; кодування UTF-8.

## 2. Таблиця endpoint-ів
| Метод | URL | Тіло запиту | Успішна відповідь | Коди |
|---|---|---|---|
| GET | `/api/movies` | — | Масив фільмів | 200 |
| GET | `/api/movies/:id` | — | Об'єкт Movie | 200 | 404 |
| GET | `/api/items` | — | Масив сеансів | 200 |
| GET | `/api/items/:id` | — | Сеанс з інформацією про місця | 200, 404 |
| POST | `/api/items` | JSON Session | Створений сеанс | 201, 400 |
| PUT | `/api/items/:id` | JSON полів Session | Оновлений сеанс | 200, 400, 404 |
| DELETE | `/api/items/:id` | — | Без тіла | 204, 404 |
| POST | `/api/bookings` | JSON Booking request | Бронювання | 201, 400, 409 |
| POST | `/api/contact` | JSON ContactMessage | Прийняте повідомлення | 201, 400 |

## 3. Моделі

### Movie
```json
{
  "id": 1,
  "title": "Назва фільму",
  "description": "Опис фільму",
  "genre": "Драма",
  "duration": 120,
  "ageRating": "16+",
  "posterUrl": "/assets/poster.webp",
  "trailerUrl": "https://example.com/trailer"
}
```

### Session (основна CRUD-сутність)
```json
{
  "id": 12,
  "movieId": 1,
  "hallId": 1,
  "startTime": "2026-11-25T18:30:00+02:00",
  "price": 220
}
```
### Booking request
```json
{
  "sessionId": 12,
  "seats": [{"row": 3, "seat": 5}, {"row": 3, "seat": 6}],
  "name": "Олена",
  "phone": "+380501234567",
  "email": "olena@example.com",
  "comment": "Прошу місця поруч",
  "consent": true
}
```
### Приклад JSON сеансу
```json
{
  "id": 12,
  "movieId": 1,
  "hallId": 1,
  "startTime": "2026-11-25T18:30:00+02:00",
  "price": 220,
  "occupiedSeats": [{"row": 1, "seat": 2}, {"row": 4, "seat": 8}]
}
```
### Contact request
```json
{
  "name": "Олена",
  "email": "olena@example.com",
  "message": "Підкажіть, будь ласка, щодо сеансу."
}
```
## 4. Правила валідації (рекомендований контракт)
> Уточнити відповідність реальному серверному коду.
- `sessionId`: позитивне ціле число, існуючий сеанс.
- `seats`: непорожній масив; від 1 до 8 місць; кожне місце — об'єкт з позитивними `row` і `seat`; без дублікатів.
- Ряд/місце має бути в межах конфігурації залу; місце не повинно бути зайняте.
- `name`: після trim непорожнє, 2–80 символів.
- `phone`: український номер, допускається формат `+380` і цифри; нормалізувати перед перевіркою.
- `email`: валідний формат, до 254 символів.
- `comment`: необов'язковий, максимум 500 символів.
- `consent`: true, якщо це обов'язкова згода з умовами.
- `totalPrice` не довіряти клієнту: сервер розраховує суму самостійно за місцями/тарифом.
- На контактній формі `name`, `email`, `message` обов'язкові; повідомлення не пусте, максимум 2000 символів.
- Якщо місце зайняли між вибором і POST, повернути `409 Conflict`.
## 5. Приклади відповідей
### 201 Created — бронювання (приклад)
```json
{
  "id": "BK-20261125-0012",
  "sessionId": 12,
  "seats": [{"row": 3, "seat": 5}, {"row": 3, "seat": 6}],
  "totalPrice": 440,
  "createdAt": "2026-11-25T16:35:00.000Z"
}
```
### 400 Bad Request — помилка валідації
```json
{
  "error": "Validation failed",
  "details": {
    "email": "Вкажіть коректну email-адресу",
    "seats": "Оберіть від 1 до 8 місць"
  }
}
```
### 409 Conflict — місце вже зайняте
```json
{
  "error": "Seats unavailable",
  "message": "Одне або кілька місць уже заброньовано. Оберіть інші."
}
```
## 6. Змінні середовища
### server/.env
```dotenv
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
DATA_FILE=./data/items.json
ADMIN_TOKEN=change-me
```
`ADMIN_TOKEN` має бути секретним, не комітити `.env`; для репозиторію залишити `.env.example` з тестовими значеннями.
### client/.env
```dotenv
VITE_API_URL=http://localhost:3000
```
Vite доступні клієнту лише змінні з префіксом `VITE_`; не зберігати секрети у frontend env.
## 7. CORS
- Дозволити origin, визначений `CLIENT_ORIGIN`, а не wildcard для production.
- Дозволені методи: GET, POST, PUT, DELETE, OPTIONS (за потреби).
- Дозволені заголовки: `Content-Type`, `Authorization` (для захищених admin-запитів, якщо реалізовано).
- Credentials увімкнути лише якщо вони реально потрібні; не поєднувати `credentials: true` з `origin: *`.
- Перевірити preflight-запит браузера.
## 8. Middleware (рекомендований опис; звірити з кодом)
1. `cors` — правила origin.
2. `express.json()` — парсинг JSON body.
3. Middleware логування запитів (якщо підключене).
4. Middleware перевірки admin token для CRUD сеансів (якщо реалізовано).
5. Обробники `/api/...`.
6. Обробник 404 для невідомих API маршрутів.
7. Центральний error handler, що не повертає stack trace у production.
## 9. Postman
Колекція `cinema-api.postman_collection.json` містить запити до Movies, Sessions CRUD, Booking та Contact. Встановити `baseUrl` у collection variables. Payload-и прикладів базуються на контрактові цього документа і можуть потребувати адаптації після звірки реального API.
## 10. curl приклади
```bash
curl -i http://localhost:3000/api/movies
curl -i http://localhost:3000/api/items
curl -i http://localhost:3000/api/items/12
curl -i -X POST http://localhost:3000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":12,"seats":[{"row":3,"seat":5}],"name":"Олена","phone":"+380501234567","email":"olena@example.com","consent":true}'
```
