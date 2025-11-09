// Парсинг скрипт для intertop.kz/ru-kz/
// Запуск в консоли браузера (F12) на сайте https://intertop.kz/ru-kz/

(async function() {
    console.log('🚀 Начинаем парсинг intertop.kz/ru-kz/...\n');
    
    const allProducts = [];
    const visitedUrls = new Set();
    
    // Функция для задержки
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Функция для парсинга товаров на текущей странице
    function parseCurrentPage() {
        console.log('Парсинг текущей страницы:', window.location.href);
        
        // Различные селекторы для товаров на intertop.kz
        const productSelectors = [
            '.product-item',
            '.catalog-item',
            '.goods-item',
            '[class*="product"]',
            '[class*="item-card"]',
            '[data-product-id]',
            '.item',
            'article'
        ];
        
        let productElements = [];
        for (const selector of productSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                productElements = Array.from(elements);
                console.log(`Найдено товаров с селектором "${selector}": ${elements.length}`);
                break;
            }
        }
        
        // Если не нашли, пробуем найти по структуре
        if (productElements.length === 0) {
            // Ищем все ссылки на товары
            const productLinks = document.querySelectorAll('a[href*="/product/"], a[href*="/goods/"], a[href*="/item/"]');
            if (productLinks.length > 0) {
                console.log(`Найдено ссылок на товары: ${productLinks.length}`);
                productLinks.forEach(link => {
                    const card = link.closest('[class*="card"], [class*="item"], [class*="product"]') || link.parentElement;
                    if (card) productElements.push(card);
                });
            }
        }
        
        // Удаляем дубликаты
        productElements = [...new Set(productElements)];
        
        console.log(`Всего элементов для парсинга: ${productElements.length}`);
        
        productElements.forEach((el, index) => {
            try {
                // Название товара
                const nameSelectors = [
                    'h2', 'h3', 'h4',
                    '.product-name',
                    '.item-title',
                    '.goods-name',
                    '[class*="title"]',
                    '[class*="name"]',
                    'a[href*="/product/"]',
                    'a[href*="/goods/"]'
                ];
                
                let name = '';
                for (const selector of nameSelectors) {
                    const nameEl = el.querySelector(selector);
                    if (nameEl) {
                        name = nameEl.textContent.trim();
                        if (name && name.length > 3) break;
                    }
                }
                
                // Если не нашли, пробуем из атрибутов
                if (!name) {
                    name = el.getAttribute('data-name') || 
                           el.getAttribute('title') || 
                           el.getAttribute('alt') || '';
                }
                
                if (!name || name.length < 3) {
                    return; // Пропускаем если нет названия
                }
                
                // Цена
                const priceSelectors = [
                    '.price',
                    '.product-price',
                    '.item-price',
                    '.goods-price',
                    '[class*="price"]',
                    '[data-price]',
                    '.cost',
                    '.value',
                    '[itemprop="price"]'
                ];
                
                let price = 0;
                for (const selector of priceSelectors) {
                    const priceEl = el.querySelector(selector);
                    if (priceEl) {
                        const priceText = priceEl.textContent || priceEl.getAttribute('data-price') || '';
                        // Ищем числа в тексте
                        const priceMatch = priceText.match(/(\d[\d\s]*)/);
                        if (priceMatch) {
                            const priceNum = parseInt(priceMatch[1].replace(/\s/g, ''));
                            if (priceNum > 1000) { // Минимальная цена 1000 тенге
                                price = priceNum;
                                break;
                            }
                        }
                    }
                }
                
                if (price === 0) {
                    return; // Пропускаем если нет цены
                }
                
                // Изображение
                const imgEl = el.querySelector('img');
                let image = '';
                if (imgEl) {
                    image = imgEl.src || 
                           imgEl.dataset.src || 
                           imgEl.getAttribute('data-lazy-src') ||
                           imgEl.getAttribute('data-original') ||
                           '';
                    if (image && image.startsWith('//')) {
                        image = 'https:' + image;
                    } else if (image && image.startsWith('/')) {
                        image = 'https://intertop.kz' + image;
                    }
                }
                
                // Определяем категорию по контексту
                const url = window.location.href.toLowerCase();
                const pageText = (el.textContent + ' ' + url).toLowerCase();
                
                let category = 'sneakers'; // по умолчанию
                if (pageText.includes('обувь') || pageText.includes('кроссовки') || pageText.includes('sneakers') || 
                    pageText.includes('туфли') || pageText.includes('ботинки') || url.includes('obuv')) {
                    category = 'sneakers';
                } else if (pageText.includes('рубашк') || pageText.includes('футболк') || pageText.includes('блузк') || 
                          pageText.includes('жакет') || pageText.includes('shirt') || url.includes('rubash')) {
                    category = 'shirts';
                } else if (pageText.includes('брюк') || pageText.includes('штан') || pageText.includes('шалбар') || 
                          pageText.includes('pants') || url.includes('bryuk')) {
                    category = 'pants';
                } else if (pageText.includes('куртк') || pageText.includes('жакет') || pageText.includes('jacket') || 
                          url.includes('kurtk')) {
                    category = 'jackets';
                }
                
                // Определяем пол
                let gender = 'women'; // по умолчанию
                if (url.includes('zhensk') || url.includes('женск') || url.includes('women') || 
                    url.includes('девушк') || pageText.includes('женск')) {
                    gender = 'women';
                } else if (url.includes('muzhsk') || url.includes('мужск') || url.includes('men') || 
                          url.includes('мужчин') || pageText.includes('мужск')) {
                    gender = 'men';
                }
                
                // Проверяем на дубликаты
                const isDuplicate = allProducts.some(p => 
                    p.name.toLowerCase().trim() === name.toLowerCase().trim() &&
                    Math.abs(p.price - price) < 1000
                );
                
                if (!isDuplicate) {
                    allProducts.push({
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
        
        console.log(`Товаров на странице: ${allProducts.length}`);
    }
    
    // Функция для перехода на следующую страницу
    async function goToNextPage() {
        const nextSelectors = [
            '.pagination-next',
            '.next-page',
            'a[aria-label*="next"]',
            'a[aria-label*="Next"]',
            'a[aria-label*="Следующая"]',
            'a[aria-label*="следующая"]',
            '.pagination a:last-child',
            '[class*="pagination"] a:last-child'
        ];
        
        for (const selector of nextSelectors) {
            const nextBtn = document.querySelector(selector);
            if (nextBtn && !nextBtn.classList.contains('disabled') && 
                !nextBtn.classList.contains('active')) {
                const href = nextBtn.href || nextBtn.getAttribute('onclick');
                if (href && !visitedUrls.has(href)) {
                    return nextBtn;
                }
            }
        }
        
        // Ищем по тексту
        const allLinks = document.querySelectorAll('a');
        for (const link of allLinks) {
            const text = link.textContent.toLowerCase();
            if ((text.includes('следующ') || text.includes('next') || text.includes('→')) &&
                link.href && !visitedUrls.has(link.href)) {
                return link;
            }
        }
        
        return null;
    }
    
    // Основной цикл парсинга
    const maxPages = 50; // Максимум страниц
    let currentPage = 1;
    
    // Парсим текущую страницу
    parseCurrentPage();
    visitedUrls.add(window.location.href);
    
    // Переходим на следующие страницы
    while (currentPage < maxPages) {
        await delay(2000); // Задержка между страницами
        
        const nextBtn = await goToNextPage();
        if (!nextBtn) {
            console.log('Больше страниц не найдено');
            break;
        }
        
        const nextUrl = nextBtn.href || nextBtn.getAttribute('onclick');
        if (!nextUrl || visitedUrls.has(nextUrl)) {
            break;
        }
        
        console.log(`\nПереход на страницу ${currentPage + 1}...`);
        visitedUrls.add(nextUrl);
        
        if (nextBtn.href) {
            window.location.href = nextBtn.href;
            await delay(5000); // Ждем загрузки страницы
            
            // Проверяем загрузку
            let attempts = 0;
            while (attempts < 20) {
                await delay(500);
                if (document.readyState === 'complete' && 
                    document.querySelector('body') && 
                    !document.querySelector('.loading')) {
                    break;
                }
                attempts++;
            }
        } else {
            nextBtn.click();
            await delay(5000);
        }
        
        parseCurrentPage();
        currentPage++;
    }
    
    // Удаляем дубликаты
    const uniqueProducts = [];
    const seenNames = new Set();
    
    allProducts.forEach(product => {
        const key = (product.name.toLowerCase().trim() + product.price).replace(/\s+/g, '');
        if (!seenNames.has(key) && product.price > 0 && product.name.length > 3) {
            seenNames.add(key);
            uniqueProducts.push(product);
        }
    });
    
    // Выводим результат
    console.log(`\n✅ Парсинг завершен!`);
    console.log(`Всего найдено товаров: ${allProducts.length}`);
    console.log(`Уникальных товаров: ${uniqueProducts.length}`);
    
    // Группируем по полу
    const womenProducts = uniqueProducts.filter(p => p.gender === 'women');
    const menProducts = uniqueProducts.filter(p => p.gender === 'men');
    
    console.log(`\n📊 Статистика:`);
    console.log(`- Для женщин: ${womenProducts.length}`);
    console.log(`- Для мужчин: ${menProducts.length}`);
    
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
    link.download = 'intertop-kz-products.json';
    link.textContent = '📥 Скачать JSON файл';
    link.style.cssText = 'display: block; margin: 20px 0; padding: 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; text-align: center;';
    document.body.appendChild(link);
    
    // Добавляем инструкцию
    const instruction = document.createElement('div');
    instruction.style.cssText = 'margin: 20px 0; padding: 15px; background: #f0f0f0; border-radius: 5px; border-left: 4px solid #007bff;';
    instruction.innerHTML = `
        <h3 style="margin-top: 0;">📝 Инструкция по импорту:</h3>
        <ol>
            <li>Скачайте JSON файл выше</li>
            <li>Откройте админ панель вашего сайта</li>
            <li>Нажмите кнопку "Импорттау"</li>
            <li>Выберите "JSON файл" или "JSON мәтіні"</li>
            <li>Загрузите файл или вставьте JSON текст</li>
            <li>Нажмите "Импорттау"</li>
        </ol>
    `;
    document.body.appendChild(instruction);
    
    return uniqueProducts;
})();




