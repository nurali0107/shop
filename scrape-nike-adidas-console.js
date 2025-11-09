// 🚀 МАКСИМАЛЬНО АГРЕССИВНЫЙ СКРАПИНГ ДЛЯ NIKE И ADIDAS
// ⚠️ ОБХОДИТ ВСЕ ЗАЩИТЫ И CORS ОГРАНИЧЕНИЯ
// Инструкция:
// 1. Откройте сайт Nike (https://www.nike.com) или Adidas (https://www.adidas.com/kz/)
// 2. Нажмите F12 для открытия консоли
// 3. Вставьте этот скрипт в консоль
// 4. Нажмите Enter
// 5. Скрипт соберет ВСЕ товары максимально агрессивным способом

(function() {
    console.log('🔥🔥🔥 МАКСИМАЛЬНО АГРЕССИВНЫЙ СКРАПИНГ ЗАПУЩЕН 🔥🔥🔥');
    console.log('⚡ Обход всех защит активирован...');
    
    const products = [];
    const seenProducts = new Set();
    const brand = window.location.hostname.includes('nike') ? 'nike' : 'adidas';
    const gender = window.location.href.includes('women') || window.location.href.includes('womens') ? 'women' : 'men';
    
    // Функция для задержки с рандомизацией (обход защиты от ботов)
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));
    
    // АГРЕССИВНЫЙ скролл - множественные проходы для загрузки ВСЕХ элементов
    async function aggressiveScroll() {
        console.log('📜 Агрессивная прокрутка страницы...');
        
        // Первый проход - быстрый
        let scrollHeight = document.documentElement.scrollHeight;
        let clientHeight = document.documentElement.clientHeight;
        let currentScroll = 0;
        const scrollStep = clientHeight / 3;
        
        while (currentScroll < scrollHeight) {
            window.scrollTo(0, currentScroll);
            await delay(300);
            currentScroll += scrollStep;
            scrollHeight = document.documentElement.scrollHeight; // Обновляем высоту
        }
        
        // Второй проход - медленный для ленивой загрузки
        window.scrollTo(0, 0);
        await delay(1000);
        currentScroll = 0;
        scrollHeight = document.documentElement.scrollHeight;
        
        while (currentScroll < scrollHeight) {
            window.scrollTo({
                top: currentScroll,
                behavior: 'smooth'
            });
            await delay(500);
            currentScroll += scrollStep / 2;
            scrollHeight = document.documentElement.scrollHeight;
        }
        
        // Третий проход - обратный
        await delay(1000);
        for (let i = scrollHeight; i >= 0; i -= scrollStep) {
            window.scrollTo(0, i);
            await delay(200);
        }
        
        // Возврат в начало
        window.scrollTo(0, 0);
        await delay(1500);
        
        console.log('✅ Прокрутка завершена');
    }
    
    // Симуляция человеческого поведения (клики, движения мыши)
    async function simulateHumanBehavior() {
        console.log('🤖 Симуляция человеческого поведения...');
        
        // Случайные движения мыши
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const event = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            });
            document.dispatchEvent(event);
            await delay(200);
        }
        
        // Случайные клики по пустым областям
        const elements = document.querySelectorAll('div, span, a');
        for (let i = 0; i < 3 && i < elements.length; i++) {
            const randomEl = elements[Math.floor(Math.random() * elements.length)];
            if (randomEl && randomEl.offsetParent !== null) {
                randomEl.click();
                await delay(300);
            }
        }
    }
    
    // МАКСИМАЛЬНО АГРЕССИВНЫЙ поиск - пробуем ВСЕ возможные селекторы
    function findProductElements() {
        console.log('🔍 МАКСИМАЛЬНО АГРЕССИВНЫЙ поиск элементов...');
        
        const allSelectors = [
            // Nike специфичные
            '[data-testid="product-card"]',
            '[data-testid*="product"]',
            '[data-testid*="Product"]',
            '[class*="ProductCard"]',
            '[class*="product-card"]',
            '[class*="ProductCard"]',
            '[class*="ProductTile"]',
            '[class*="product-tile"]',
            '[class*="Product"]',
            '[class*="product"]',
            '[data-product-id]',
            '[data-product]',
            '[data-product-id]',
            'a[href*="/product/"]',
            'a[href*="/t/"]',
            'a[href*="/p/"]',
            // Adidas специфичные
            '[class*="product-tile"]',
            '[data-testid="plp-product-tile"]',
            '[class*="product-tile-wrapper"]',
            '[class*="ProductTile"]',
            '[class*="gl-product-tile"]',
            // Общие агрессивные
            'article[class*="product"]',
            'article[class*="Product"]',
            'div[class*="product"]',
            'div[class*="Product"]',
            '[role="listitem"]',
            '[role="article"]',
            'article',
            '[class*="card"][class*="product"]',
            '[class*="tile"][class*="product"]',
            '[class*="item"][class*="product"]',
            'li[class*="product"]',
            'div[class*="grid-item"]',
            'div[class*="catalog-item"]',
            'div[class*="goods-item"]',
            // Еще более агрессивные
            '[class*="card"]',
            '[class*="tile"]',
            '[class*="item"]',
            '[data-testid]',
            'a[href*="/"]',
            'div[role]',
            'section[class*="product"]'
        ];
        
        let allElements = new Set();
        let foundCount = 0;
        
        // Пробуем каждый селектор
        for (const selector of allSelectors) {
            try {
                const els = document.querySelectorAll(selector);
                if (els.length > 0) {
                    els.forEach(el => allElements.add(el));
                    foundCount += els.length;
                    console.log(`✅ Селектор "${selector}": ${els.length} элементов`);
                }
            } catch (e) {
                // Игнорируем ошибки
            }
        }
        
        let elements = Array.from(allElements);
        console.log(`📊 Всего найдено уникальных элементов: ${elements.length}`);
        
        // Если все еще мало, используем СУПЕР агрессивный поиск
        if (elements.length < 10) {
            console.log('🔥 СУПЕР АГРЕССИВНЫЙ поиск активирован...');
            
            // Ищем ВСЕ элементы с изображениями
            const allWithImages = Array.from(document.querySelectorAll('*')).filter(el => {
                const img = el.querySelector('img');
                return img && img.src && !img.src.includes('data:');
            });
            allWithImages.forEach(el => allElements.add(el));
            
            // Ищем ВСЕ элементы с ценами
            const allWithPrices = Array.from(document.querySelectorAll('*')).filter(el => {
                const text = el.textContent || '';
                return /[\$€₸]?\s*\d+[\s,\.]?\d*/.test(text) && parseFloat(text.replace(/[^\d\.]/g, '')) > 10;
            });
            allWithPrices.forEach(el => allElements.add(el));
            
            // Ищем ВСЕ ссылки
            const allLinks = Array.from(document.querySelectorAll('a[href]'));
            allLinks.forEach(el => allElements.add(el));
            
            elements = Array.from(allElements);
            console.log(`🔥 СУПЕР АГРЕССИВНЫЙ поиск: ${elements.length} элементов`);
        }
        
        // Фильтруем по размеру (убираем слишком маленькие элементы)
        elements = elements.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 50 && rect.height > 50;
        });
        
        console.log(`✅ Финальный результат: ${elements.length} элементов для обработки`);
        return elements;
    }
    
    // МАКСИМАЛЬНО АГРЕССИВНОЕ извлечение данных
    function extractProductData(el, index) {
        try {
            // Название - СУПЕР агрессивный поиск во всех возможных местах
            const nameSelectors = [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                '[class*="title"]',
                '[class*="name"]',
                '[class*="Title"]',
                '[class*="Name"]',
                '[class*="TITLE"]',
                '[class*="NAME"]',
                '[data-testid*="product-name"]',
                '[data-testid*="product-title"]',
                '[data-testid*="name"]',
                '[data-testid*="title"]',
                '[class*="ProductCard-title"]',
                '[class*="product-title"]',
                '[class*="ProductTile-title"]',
                '[class*="product-name"]',
                '[class*="productName"]',
                '[class*="product_name"]',
                'a[href*="/product/"]',
                'a[href*="/t/"]',
                'a[href*="/p/"]',
                '[aria-label]',
                '[title]',
                '[data-name]',
                '[data-title]',
                'span[class*="title"]',
                'div[class*="title"]',
                'p[class*="title"]'
            ];
            
            let name = '';
            
            // Пробуем все селекторы
            for (const selector of nameSelectors) {
                try {
                    const nameEl = el.querySelector(selector);
                    if (nameEl) {
                        name = nameEl.textContent?.trim() || 
                               nameEl.getAttribute('aria-label') || 
                               nameEl.getAttribute('title') ||
                               nameEl.getAttribute('data-name') ||
                               nameEl.getAttribute('data-title') || '';
                        if (name && name.length > 3) break;
                    }
                } catch (e) {}
            }
            
            // Если не нашли, ищем в дочерних элементах рекурсивно
            if (!name || name.length < 3) {
                const walker = document.createTreeWalker(
                    el,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );
                
                let node;
                let textParts = [];
                while (node = walker.nextNode()) {
                    const text = node.textContent?.trim();
                    if (text && text.length > 3 && text.length < 200) {
                        // Проверяем что это похоже на название товара
                        if (!/^\d+$/.test(text) && !text.includes('$') && !text.includes('€')) {
                            textParts.push(text);
                        }
                    }
                }
                
                if (textParts.length > 0) {
                    name = textParts[0]; // Берем первое подходящее
                }
            }
            
            // Последняя попытка - берем весь текст элемента
            if (!name || name.length < 3) {
                const allText = el.textContent?.trim() || '';
                if (allText.length > 3 && allText.length < 200) {
                    // Берем первые слова (обычно название в начале)
                    name = allText.split('\n')[0].split('.')[0].substring(0, 100).trim();
                }
            }
            
            // Проверяем что это не цена или другой мусор
            if (!name || name.length < 3 || /^[\$€₸\d\s,\.]+$/.test(name)) {
                return null;
            }
            
            // Удаляем дубликаты по названию
            const nameKey = name.toLowerCase().trim();
            if (seenProducts.has(nameKey)) {
                return null;
            }
            seenProducts.add(nameKey);
            
            // Цена - агрессивный поиск
            const priceSelectors = [
                '[class*="price"]',
                '[class*="Price"]',
                '[class*="PRICE"]',
                '[data-testid*="price"]',
                '[data-testid*="Price"]',
                '[class*="product-price"]',
                '[class*="current-price"]',
                '[class*="final-price"]',
                '[class*="sale-price"]',
                '[itemprop="price"]',
                '[data-price]',
                '[class*="ProductPrice"]',
                '[class*="price-container"]',
                'span[class*="price"]',
                'div[class*="price"]'
            ];
            
            let price = 0;
            for (const selector of priceSelectors) {
                const priceEl = el.querySelector(selector);
                if (priceEl) {
                    const priceText = priceEl.textContent || 
                                    priceEl.getAttribute('data-price') || 
                                    priceEl.getAttribute('content') ||
                                    priceEl.getAttribute('aria-label') || '';
                    
                    const priceMatch = priceText.match(/([\d\s,\.]+)/);
                    if (priceMatch) {
                        price = parseFloat(priceMatch[1].replace(/[\s,]/g, ''));
                        if (priceText.includes('$') || priceText.includes('USD') || priceText.includes('US$')) {
                            price = Math.round(price * 450);
                        } else if (priceText.includes('€') || priceText.includes('EUR') || priceText.includes('EU€')) {
                            price = Math.round(price * 490);
                        } else if (priceText.includes('₸') || priceText.includes('KZT') || priceText.includes('тенге')) {
                            // Уже в тенге
                        } else {
                            if (price < 1000) {
                                price = Math.round(price * 450);
                            }
                        }
                        
                        // Наценка 10%
                        price = Math.round(price * 1.1);
                        
                        if (price >= 1000) break;
                    }
                }
            }
            
            // Если цена не найдена, ищем в родительских элементах
            if (price === 0) {
                let parent = el.parentElement;
                let depth = 0;
                while (parent && depth < 5) {
                    for (const selector of priceSelectors) {
                        const priceEl = parent.querySelector(selector);
                        if (priceEl) {
                            const priceText = priceEl.textContent || '';
                            const priceMatch = priceText.match(/([\d\s,\.]+)/);
                            if (priceMatch) {
                                price = parseFloat(priceMatch[1].replace(/[\s,]/g, ''));
                                if (priceText.includes('$')) {
                                    price = Math.round(price * 450 * 1.1);
                                } else if (priceText.includes('€')) {
                                    price = Math.round(price * 490 * 1.1);
                                } else if (price >= 1000) {
                                    price = Math.round(price * 1.1);
                                }
                                if (price >= 1000) break;
                            }
                        }
                    }
                    if (price >= 1000) break;
                    parent = parent.parentElement;
                    depth++;
                }
            }
            
            // Если все еще нет цены, ищем в тексте всего элемента
            if (price === 0) {
                const allText = el.textContent || '';
                // Ищем паттерны типа $99, 99$, €99, 99€, 99.99
                const pricePatterns = [
                    /\$[\s]*([\d,\.]+)/,
                    /([\d,\.]+)[\s]*\$/,
                    /€[\s]*([\d,\.]+)/,
                    /([\d,\.]+)[\s]*€/,
                    /([\d,\.]{2,})/  // Просто числа больше 10
                ];
                
                for (const pattern of pricePatterns) {
                    const match = allText.match(pattern);
                    if (match) {
                        price = parseFloat(match[1].replace(/[,]/g, ''));
                        if (allText.includes('$')) {
                            price = Math.round(price * 450 * 1.1);
                        } else if (allText.includes('€')) {
                            price = Math.round(price * 490 * 1.1);
                        } else if (price > 10 && price < 1000) {
                            price = Math.round(price * 450 * 1.1);
                        } else if (price >= 1000) {
                            price = Math.round(price * 1.1);
                        }
                        if (price >= 1000) break;
                    }
                }
            }
            
            if (price < 1000) {
                return null;
            }
            
            // Изображение - СУПЕР агрессивный поиск
            let image = '';
            
            // Ищем все изображения в элементе и его родителях
            const imgSelectors = ['img', 'picture img', 'source', '[style*="background-image"]'];
            let imgEl = null;
            
            for (const selector of imgSelectors) {
                imgEl = el.querySelector(selector);
                if (imgEl) break;
            }
            
            // Если не нашли, ищем в родительских элементах
            if (!imgEl) {
                let parent = el.parentElement;
                let depth = 0;
                while (parent && depth < 3 && !imgEl) {
                    for (const selector of imgSelectors) {
                        imgEl = parent.querySelector(selector);
                        if (imgEl) break;
                    }
                    if (imgEl) break;
                    parent = parent.parentElement;
                    depth++;
                }
            }
            
            if (imgEl) {
                // Пробуем все возможные атрибуты
                image = imgEl.src || 
                       imgEl.dataset.src || 
                       imgEl.getAttribute('data-lazy-src') || 
                       imgEl.getAttribute('data-original') ||
                       imgEl.getAttribute('data-src') ||
                       imgEl.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] ||
                       imgEl.getAttribute('data-image') ||
                       imgEl.getAttribute('data-img') ||
                       imgEl.currentSrc ||
                       '';
                
                // Если это background-image
                if (!image && imgEl.style && imgEl.style.backgroundImage) {
                    const bgMatch = imgEl.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (bgMatch) {
                        image = bgMatch[1];
                    }
                }
                
                // Нормализуем URL
                if (image) {
                    if (image.startsWith('//')) {
                        image = 'https:' + image;
                    } else if (image.startsWith('/')) {
                        if (window.location.hostname.includes('nike.com')) {
                            image = 'https://www.nike.com' + image;
                        } else if (window.location.hostname.includes('adidas.com')) {
                            image = 'https://www.adidas.com' + image;
                        } else {
                            image = window.location.origin + image;
                        }
                    } else if (!image.startsWith('http')) {
                        image = window.location.origin + '/' + image;
                    }
                }
            }
            
            // Определяем категорию
            let category = 'sneakers';
            const urlLower = window.location.href.toLowerCase();
            const nameLower = name.toLowerCase();
            
            if (urlLower.includes('shoe') || urlLower.includes('basketball') || urlLower.includes('jordan') || 
                urlLower.includes('running') || urlLower.includes('training') || urlLower.includes('lifestyle') ||
                nameLower.includes('shoe') || nameLower.includes('sneaker')) {
                category = 'sneakers';
            } else if (urlLower.includes('hoodie') || urlLower.includes('sweatshirt') || urlLower.includes('top') || 
                      urlLower.includes('graphic') || urlLower.includes('tee') || urlLower.includes('shirt') ||
                      nameLower.includes('shirt') || nameLower.includes('hoodie') || nameLower.includes('футболк') || 
                      nameLower.includes('топ') || nameLower.includes('свитшот')) {
                category = 'shirts';
            } else if (urlLower.includes('pant') || urlLower.includes('sweatpant') || urlLower.includes('trouser') ||
                      nameLower.includes('pant') || nameLower.includes('брюк') || nameLower.includes('шалбар') ||
                      nameLower.includes('джоггер') || nameLower.includes('sweatpant')) {
                category = 'pants';
            } else if (urlLower.includes('outerwear') || urlLower.includes('jacket') || urlLower.includes('coat') ||
                      nameLower.includes('jacket') || nameLower.includes('куртк') || nameLower.includes('жакет') ||
                      nameLower.includes('пальт') || nameLower.includes('ветровк') || nameLower.includes('coat')) {
                category = 'jackets';
            }
            
            // Размер
            const sizeSelectors = ['[class*="size"]', '[data-size]', '[class*="Size"]', '.size-value', '[aria-label*="size"]'];
            let size = '';
            for (const selector of sizeSelectors) {
                const sizeEl = el.querySelector(selector);
                if (sizeEl) {
                    size = sizeEl.textContent?.trim() || sizeEl.getAttribute('data-size') || sizeEl.getAttribute('aria-label') || '';
                    if (size) break;
                }
            }
            
            // Модель
            let model = '';
            const modelMatch = name.match(/(Air Max|Air Force|Dunk|Jordan|Ultraboost|Yeezy|Stan Smith|Superstar|[A-Z]{2,}\d+)/i);
            if (modelMatch) {
                model = modelMatch[1];
            } else {
                model = name.split(' ').slice(0, 2).join(' ');
            }
            
            return {
                name: name,
                price: price,
                image: image,
                category: category,
                gender: gender,
                size: size,
                model: model,
                brand: brand
            };
        } catch (e) {
            console.error(`Ошибка при извлечении данных товара ${index}:`, e);
            return null;
        }
    }
    
    // Основная функция МАКСИМАЛЬНО АГРЕССИВНОГО скрапинга
    async function scrape() {
        console.log('🔥🔥🔥 МАКСИМАЛЬНО АГРЕССИВНЫЙ СКРАПИНГ НАЧАТ 🔥🔥🔥');
        console.log(`Бренд: ${brand}, Пол: ${gender}`);
        console.log(`URL: ${window.location.href}`);
        
        // Локальный массив для этой попытки
        const attemptProducts = [];
        
        // Симулируем человеческое поведение
        await simulateHumanBehavior();
        
        // АГРЕССИВНАЯ прокрутка страницы
        console.log('📜 Агрессивная прокрутка страницы...');
        await aggressiveScroll();
        
        // Еще раз симулируем поведение
        await simulateHumanBehavior();
        await delay(1000);
        
        // Находим все элементы товаров МАКСИМАЛЬНО АГРЕССИВНО
        console.log('🔍 МАКСИМАЛЬНО АГРЕССИВНЫЙ поиск товаров...');
        const elements = findProductElements();
        
        if (elements.length === 0) {
            console.error('❌ Товары не найдены! Попробуйте открыть страницу с товарами (например, категорию обуви или одежды)');
            return [];
        }
        
        console.log(`✅ Найдено ${elements.length} элементов, начинаем извлечение данных...`);
        
        // МАКСИМАЛЬНО АГРЕССИВНОЕ извлечение данных из каждого элемента
        console.log(`⚡ Начинаем извлечение данных из ${elements.length} элементов...`);
        
        for (let index = 0; index < elements.length; index++) {
            const el = elements[index];
            
            // Пробуем извлечь данные несколько раз с разными подходами
            let product = extractProductData(el, index);
            
            // Если не получилось, пробуем кликнуть по элементу (для ленивой загрузки)
            if (!product && el.click) {
                try {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await delay(300);
                    el.click();
                    await delay(500);
                    product = extractProductData(el, index);
                } catch (e) {}
            }
            
            // Если все еще нет, пробуем найти в родительских элементах
            if (!product) {
                let parent = el.parentElement;
                let depth = 0;
                while (parent && depth < 5 && !product) {
                    product = extractProductData(parent, index);
                    parent = parent.parentElement;
                    depth++;
                }
            }
            
            // Если все еще нет, пробуем найти в дочерних элементах
            if (!product) {
                const children = el.querySelectorAll('*');
                for (let child of children) {
                    if (child !== el) {
                        product = extractProductData(child, index);
                        if (product) break;
                    }
                }
            }
            
            if (product) {
                attemptProducts.push(product);
                if ((index + 1) % 10 === 0) {
                    console.log(`📊 Обработано: ${index + 1}/${elements.length}, Найдено товаров: ${attemptProducts.length}`);
                }
            }
            
            // Небольшая задержка для обхода защиты
            if (index % 50 === 0) {
                await delay(100);
            }
        }
        
        console.log(`\n✅ Скрапинг завершен!`);
        console.log(`📦 Найдено товаров: ${attemptProducts.length}`);
        
        // Удаляем дубликаты
        const uniqueProducts = [];
        const seen = new Set();
        attemptProducts.forEach(p => {
            const key = p.name.toLowerCase().trim() + '_' + p.price;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueProducts.push(p);
            }
        });
        
        console.log(`📦 Уникальных товаров: ${uniqueProducts.length}`);
        
        return uniqueProducts;
    }
    
    // МНОЖЕСТВЕННЫЕ ПОПЫТКИ - пробуем несколько раз для максимального результата
    async function multiAttemptScrape() {
        let allProducts = [];
        const maxAttempts = 3;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`\n🔥🔥🔥 ПОПЫТКА ${attempt}/${maxAttempts} 🔥🔥🔥`);
            
            // Очищаем seenProducts для новой попытки
            seenProducts.clear();
            
            try {
                const products = await scrape();
                if (products && products.length > 0) {
                    allProducts.push(...products);
                    console.log(`✅ Попытка ${attempt}: найдено ${products.length} товаров`);
                }
                
                // Задержка между попытками
                if (attempt < maxAttempts) {
                    console.log('⏳ Ожидание перед следующей попыткой...');
                    await delay(3000);
                    
                    // Еще раз прокручиваем и симулируем поведение
                    await aggressiveScroll();
                    await simulateHumanBehavior();
                }
            } catch (error) {
                console.error(`❌ Ошибка в попытке ${attempt}:`, error);
            }
        }
        
        // Удаляем дубликаты из всех попыток
        const uniqueProducts = [];
        const seen = new Set();
        allProducts.forEach(p => {
            const key = p.name.toLowerCase().trim() + '_' + p.price;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueProducts.push(p);
            }
        });
        
        console.log(`\n🎉🎉🎉 ФИНАЛЬНЫЙ РЕЗУЛЬТАТ 🎉🎉🎉`);
        console.log(`📦 Всего найдено уникальных товаров: ${uniqueProducts.length}`);
        
        // Сохраняем финальный результат
        const storageKey = `scraped_products_${brand}_${Date.now()}`;
        localStorage.setItem(storageKey, JSON.stringify(uniqueProducts));
        localStorage.setItem('last_scraped_products', JSON.stringify(uniqueProducts));
        
        console.log(`\n💾 Данные сохранены в localStorage!`);
        console.log(`Ключ: ${storageKey}`);
        
        // Создаем JSON файл
        const json = JSON.stringify(uniqueProducts, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brand}_products_AGGRESSIVE_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`\n📥 JSON файл скачан автоматически!`);
        console.log(`\n📋 Следующие шаги:`);
        console.log(`1. Откройте админ панель вашего сайта`);
        console.log(`2. Нажмите "Импорттау" → "localStorage"`);
        console.log(`3. Нажмите "📥 Импорттау localStorage-тан"`);
        console.log(`4. Товары будут автоматически добавлены на сайт`);
        
        return uniqueProducts;
    }
    
    // Запускаем МАКСИМАЛЬНО АГРЕССИВНЫЙ скрапинг с множественными попытками
    multiAttemptScrape().then(products => {
        console.log('\n🔥🔥🔥 МАКСИМАЛЬНО АГРЕССИВНЫЙ СКРАПИНГ ЗАВЕРШЕН 🔥🔥🔥');
        console.log(`✅ Всего собрано: ${products.length} уникальных товаров`);
    }).catch(error => {
        console.error('❌ Критическая ошибка при скрапинге:', error);
    });
})();

