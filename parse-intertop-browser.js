// Скрипт для запуска в консоли браузера на intertop.kz
// Откройте консоль браузера (F12) на сайте intertop.kz и вставьте этот код

(async function() {
    console.log('🚀 Начинаем парсинг intertop.kz...\n');
    
    const products = [];
    
    // Функция для задержки
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Функция для парсинга товаров на текущей странице
    function parsePage() {
        console.log('Парсинг текущей страницы...');
        
        // Различные селекторы для товаров
        const selectors = [
            '[class*="product"]',
            '[class*="item"]',
            '[data-product]',
            '.product-item',
            '.catalog-item',
            '.goods-item'
        ];
        
        let productElements = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                productElements = Array.from(elements);
            }
        });
        
        // Если не нашли, пробуем найти любые карточки товаров
        if (productElements.length === 0) {
            productElements = Array.from(document.querySelectorAll('article, [class*="card"], [class*="tile"]'));
        }
        
        console.log(`Найдено элементов: ${productElements.length}`);
        
        productElements.forEach((el, index) => {
            try {
                // Название
                const nameSelectors = [
                    'h2', 'h3', 'h4',
                    '[class*="title"]',
                    '[class*="name"]',
                    'a[href*="product"]',
                    '.product-name',
                    '.item-title'
                ];
                
                let name = '';
                for (const selector of nameSelectors) {
                    const nameEl = el.querySelector(selector);
                    if (nameEl) {
                        name = nameEl.textContent.trim();
                        if (name) break;
                    }
                }
                
                if (!name) {
                    name = el.getAttribute('data-name') || el.getAttribute('title') || '';
                }
                
                if (!name) return; // Пропускаем если нет названия
                
                // Цена
                const priceSelectors = [
                    '[class*="price"]',
                    '[data-price]',
                    '.price',
                    '.cost',
                    '.value'
                ];
                
                let price = 0;
                for (const selector of priceSelectors) {
                    const priceEl = el.querySelector(selector);
                    if (priceEl) {
                        const priceText = priceEl.textContent || priceEl.getAttribute('data-price') || '';
                        const priceMatch = priceText.match(/(\d+)/);
                        if (priceMatch) {
                            price = parseInt(priceMatch[1]);
                            if (price > 0) break;
                        }
                    }
                }
                
                if (price === 0) return; // Пропускаем если нет цены
                
                // Изображение
                const imgEl = el.querySelector('img');
                let image = '';
                if (imgEl) {
                    image = imgEl.src || imgEl.dataset.src || imgEl.getAttribute('data-lazy-src') || '';
                    if (image && image.startsWith('//')) {
                        image = 'https:' + image;
                    }
                }
                
                // Категория (определяем по контексту страницы)
                const url = window.location.href.toLowerCase();
                let category = 'sneakers';
                if (url.includes('obuv') || url.includes('кроссовки') || url.includes('обувь')) {
                    category = 'sneakers';
                } else if (url.includes('rubashki') || url.includes('рубашки') || url.includes('жейде')) {
                    category = 'shirts';
                } else if (url.includes('bryuki') || url.includes('брюки') || url.includes('шалбар')) {
                    category = 'pants';
                } else if (url.includes('kurtki') || url.includes('куртки') || url.includes('жакет')) {
                    category = 'jackets';
                }
                
                // Пол (определяем по URL)
                const gender = (url.includes('zhensk') || url.includes('женск') || url.includes('women')) ? 'women' : 'men';
                
                // Проверяем, не дубликат ли
                const isDuplicate = products.some(p => 
                    p.name.toLowerCase().trim() === name.toLowerCase().trim()
                );
                
                if (!isDuplicate) {
                    products.push({
                        name: name,
                        description: `${name}. 100% оригинал. ${gender === 'women' ? 'Әйелдерге арналған.' : 'Ерлерге арналған.'}`,
                        price: price,
                        image: image,
                        category: category,
                        gender: gender
                    });
                }
            } catch (e) {
                console.error('Ошибка парсинга товара:', e);
            }
        });
        
        console.log(`Товаров на странице: ${products.length}`);
    }
    
    // Парсим текущую страницу
    parsePage();
    
    // Пытаемся перейти на следующие страницы
    console.log('\nПереход на следующие страницы...');
    const maxPages = 10;
    
    for (let i = 2; i <= maxPages; i++) {
        // Ищем кнопку следующей страницы
        const nextSelectors = [
            `a[href*="page=${i}"]`,
            `a[href*="p=${i}"]`,
            '[class*="pagination"] a',
            '[class*="next"]',
            '.pagination-next',
            '.next-page'
        ];
        
        let nextBtn = null;
        for (const selector of nextSelectors) {
            const btn = document.querySelector(selector);
            if (btn && (btn.textContent.includes(i) || btn.href.includes(`page=${i}`) || btn.href.includes(`p=${i}`))) {
                nextBtn = btn;
                break;
            }
        }
        
        if (nextBtn) {
            console.log(`Переход на страницу ${i}...`);
            nextBtn.click();
            await delay(3000); // Ждем загрузки
            
            // Проверяем, загрузилась ли страница
            let attempts = 0;
            while (attempts < 10) {
                await delay(500);
                if (document.readyState === 'complete') {
                    break;
                }
                attempts++;
            }
            
            parsePage();
        } else {
            console.log(`Страница ${i} не найдена, завершаем парсинг`);
            break;
        }
    }
    
    // Удаляем дубликаты
    const uniqueProducts = [];
    const seenNames = new Set();
    
    products.forEach(product => {
        const key = product.name.toLowerCase().trim();
        if (!seenNames.has(key)) {
            seenNames.add(key);
            uniqueProducts.push(product);
        }
    });
    
    // Выводим результат
    console.log(`\n✅ Парсинг завершен!`);
    console.log(`Всего найдено товаров: ${products.length}`);
    console.log(`Уникальных товаров: ${uniqueProducts.length}`);
    console.log('\n📋 JSON данные:');
    console.log(JSON.stringify(uniqueProducts, null, 2));
    
    // Копируем в буфер обмена
    const json = JSON.stringify(uniqueProducts, null, 2);
    try {
        await navigator.clipboard.writeText(json);
        console.log('\n✅ JSON скопирован в буфер обмена!');
        console.log('Теперь вы можете вставить его в админ панель для импорта.');
    } catch (e) {
        console.log('\n⚠️ Не удалось скопировать в буфер. Скопируйте JSON вручную из консоли.');
    }
    
    // Создаем ссылку для скачивания
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'intertop-products.json';
    link.textContent = 'Скачать JSON файл';
    link.style.cssText = 'display: block; margin-top: 10px; padding: 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;';
    document.body.appendChild(link);
    
    return uniqueProducts;
})();




