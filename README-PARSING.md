# Инструкция по парсингу товаров с intertop.kz

## Способ 1: Браузерная консоль (Рекомендуется)

1. Откройте сайт https://intertop.kz/ru-kz/
2. Нажмите F12 для открытия консоли разработчика
3. Перейдите на вкладку "Console"
4. Откройте файл `parse-intertop-kz.js` и скопируйте весь код
5. Вставьте код в консоль браузера
6. Нажмите Enter
7. Скрипт автоматически:
   - Парсит товары с текущей страницы
   - Переходит на следующие страницы
   - Собирает все товары для мужчин и женщин
   - Создает JSON файл для скачивания
   - Копирует JSON в буфер обмена

## Способ 2: Ручной парсинг по категориям

1. Откройте категорию товаров на intertop.kz:
   - Для женщин: https://intertop.kz/ru-kz/zhenskaya-obuv/
   - Для мужчин: https://intertop.kz/ru-kz/muzhskaya-obuv/
2. Откройте консоль (F12)
3. Используйте упрощенный скрипт:

```javascript
// Упрощенный скрипт для одной страницы
(function() {
    const products = [];
    document.querySelectorAll('[class*="product"], [class*="item"]').forEach(el => {
        const name = el.querySelector('h2, h3, .product-name, [class*="title"]')?.textContent.trim();
        const priceEl = el.querySelector('.price, [class*="price"]');
        const price = priceEl ? parseInt(priceEl.textContent.replace(/\D/g, '')) : 0;
        const img = el.querySelector('img')?.src || '';
        
        if (name && price > 0) {
            products.push({
                name: name,
                description: name + '. 100% оригинал.',
                price: price,
                image: img,
                category: 'sneakers',
                gender: window.location.href.includes('zhensk') ? 'women' : 'men'
            });
        }
    });
    
    console.log(JSON.stringify(products, null, 2));
    navigator.clipboard.writeText(JSON.stringify(products, null, 2));
    console.log('✅ JSON скопирован в буфер обмена!');
})();
```

## Импорт в админ панель

1. Откройте админ панель (пароль: `Nural1103@`)
2. Нажмите кнопку "Импорттау"
3. Выберите способ импорта:
   - **JSON файл** - если скачали файл
   - **JSON мәтіні** - если скопировали из консоли
4. Вставьте JSON данные
5. Выберите "Заменить все товары" если нужно
6. Нажмите "Импорттау"

## Формат данных

Каждый товар должен иметь:
```json
{
    "name": "Название товара",
    "description": "Описание товара. 100% оригинал.",
    "price": 45000,
    "image": "https://...",
    "category": "sneakers",
    "gender": "women"
}
```

Категории:
- `sneakers` - Кроссовки/Обувь
- `shirts` - Рубашки/Футболки
- `pants` - Брюки/Штаны
- `jackets` - Куртки/Жакеты

Пол:
- `women` - Для женщин
- `men` - Для мужчин

## Примечания

- Скрипт автоматически определяет категорию и пол по URL и содержимому страницы
- Дубликаты автоматически удаляются
- Минимальная цена товара: 1000 тенге
- Скрипт работает только на сайте intertop.kz




