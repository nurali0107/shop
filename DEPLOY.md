# 🚀 Деплой на Render.com

## Быстрая инструкция

### 1. Подготовка репозитория
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

### 2. Создание PostgreSQL базы данных на Render

1. Зайдите на [render.com](https://render.com)
2. Нажмите **"New +"** → **"PostgreSQL"**
3. Настройки:
   - **Name**: `shopkz-db`
   - **Database**: `shopkz`
   - **User**: `shopkz_user`
   - **Region**: Выберите ближайший (например, Frankfurt)
4. Нажмите **"Create Database"**
5. Скопируйте **Internal Database URL** (он будет автоматически подключен)

### 3. Создание Web Service

1. Нажмите **"New +"** → **"Web Service"**
2. Подключите ваш GitHub репозиторий
3. Настройки:
   - **Name**: `shopkz`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Тот же, что и база данных

4. **Environment Variables** (добавьте):
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (автоматически подключится из PostgreSQL)

5. Нажмите **"Create Web Service"**

### 4. Проверка

После деплоя (обычно 2-3 минуты):
- Откройте ваш сайт: `https://shopkz.onrender.com`
- Проверьте API: `https://shopkz.onrender.com/api/health`
- Должно вернуть: `{"status":"ok","database":"connected"}`

## Структура проекта

```
.
├── server.js          # Express сервер (бэкенд)
├── api.js             # API клиент для фронтенда
├── package.json       # Зависимости Node.js
├── render.yaml        # Конфигурация Render (опционально)
├── index.html         # Главная страница
├── admin.html         # Админ панель
├── script.js          # Фронтенд логика
├── admin.js           # Админ логика
└── ...                # Остальные файлы
```

## API Endpoints

- `GET /api/products` - Все товары
- `GET /api/products/:id` - Товар по ID
- `POST /api/products` - Создать товар
- `PUT /api/products/:id` - Обновить товар
- `DELETE /api/products/:id` - Удалить товар
- `DELETE /api/products` - Удалить несколько (body: {ids: [1,2,3]})
- `GET /api/orders` - Все заказы
- `POST /api/orders` - Создать заказ
- `GET /api/reviews` - Все отзывы
- `POST /api/reviews` - Создать отзыв
- `GET /api/health` - Проверка здоровья

## Оптимизация

✅ **Уже реализовано:**
- Connection pooling (max: 20 соединений)
- Индексы в базе данных для быстрых запросов
- Кэширование на уровне браузера
- Fallback на localStorage если API недоступен
- Асинхронная загрузка данных

## Локальная разработка

1. Установите PostgreSQL
2. Создайте `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/shopkz
   PORT=3000
   NODE_ENV=development
   ```
3. Запустите: `npm install && npm start`

## Важные заметки

- База данных автоматически инициализируется при первом запуске
- Все статические файлы раздаются из корня проекта
- API работает с fallback на localStorage для офлайн режима
- Сайт оптимизирован для быстрой загрузки

## Мониторинг

- Render предоставляет встроенные логи
- Метрики производительности в реальном времени
- Автоматическое масштабирование



