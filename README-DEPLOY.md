# Деплой на Render

## Быстрый старт

### 1. Подготовка

1. Создайте аккаунт на [Render.com](https://render.com)
2. Подключите ваш GitHub репозиторий

### 2. Создание PostgreSQL базы данных

1. В панели Render нажмите "New +" → "PostgreSQL"
2. Выберите:
   - **Name**: `shopkz-db`
   - **Database**: `shopkz`
   - **User**: `shopkz_user`
   - **Region**: Выберите ближайший регион
3. Нажмите "Create Database"
4. Скопируйте **Internal Database URL** (он будет использован автоматически)

### 3. Деплой веб-сервиса

1. В панели Render нажмите "New +" → "Web Service"
2. Подключите ваш GitHub репозиторий
3. Настройки:
   - **Name**: `shopkz`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Выберите тот же регион, что и база данных

4. В разделе **Environment Variables** добавьте:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (автоматически подключится из PostgreSQL)

5. Нажмите "Create Web Service"

### 4. Настройка статических файлов

Все файлы (`index.html`, `script.js`, `styles.css` и т.д.) должны быть в корне проекта. Сервер автоматически будет их раздавать.

### 5. Проверка

После деплоя:
1. Откройте ваш сайт (URL будет вида `https://shopkz.onrender.com`)
2. Проверьте `/api/health` - должно вернуть `{"status":"ok","database":"connected"}`
3. Проверьте главную страницу

## Структура проекта

```
.
├── server.js          # Express сервер
├── api.js             # API клиент для фронтенда
├── package.json       # Зависимости
├── render.yaml        # Конфигурация для Render
├── index.html         # Главная страница
├── script.js          # Фронтенд логика
├── admin.html         # Админ панель
├── admin.js           # Админ логика
└── ...                # Остальные файлы
```

## API Endpoints

### Products
- `GET /api/products` - Получить все товары (с фильтрами: ?category=, ?gender=, ?brand=)
- `GET /api/products/:id` - Получить товар по ID
- `POST /api/products` - Создать товар
- `PUT /api/products/:id` - Обновить товар
- `DELETE /api/products/:id` - Удалить товар
- `DELETE /api/products` - Удалить несколько товаров (body: {ids: [1,2,3]})

### Orders
- `GET /api/orders` - Получить все заказы
- `POST /api/orders` - Создать заказ
- `PUT /api/orders/:id/status` - Обновить статус заказа

### Reviews
- `GET /api/reviews` - Получить отзывы
- `POST /api/reviews` - Создать отзыв

### Health
- `GET /api/health` - Проверка здоровья сервера и БД

## Оптимизация производительности

1. **Кэширование**: Используйте CDN для статических файлов
2. **Индексы**: База данных уже имеет индексы на часто используемые поля
3. **Connection Pooling**: Настроен пул соединений (max: 20)
4. **Compression**: Добавьте gzip compression в production

## Локальная разработка

1. Установите PostgreSQL локально
2. Создайте `.env` файл:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/shopkz
   PORT=3000
   NODE_ENV=development
   ```
3. Запустите: `npm install && npm start`
4. Для разработки: `npm run dev` (с nodemon)

## Миграции

База данных автоматически инициализируется при первом запуске сервера. Таблицы создаются автоматически если их нет.

## Мониторинг

- Render предоставляет встроенный мониторинг
- Логи доступны в панели Render
- Метрики производительности в реальном времени

## Безопасность

- Используйте HTTPS (Render предоставляет автоматически)
- Настройте CORS для production
- Используйте переменные окружения для секретов
- Регулярно обновляйте зависимости

## Масштабирование

- Render автоматически масштабирует сервис
- Для высоких нагрузок используйте несколько инстансов
- Настройте connection pooling для БД



