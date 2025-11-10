// Admin password
const ADMIN_PASSWORD = 'Nural1103@';

// Parser password (отдельный пароль для парсинга)
// Пароль устанавливается через админ панель и хранится в localStorage
function getParserPassword() {
    return localStorage.getItem('parserPassword') || null;
}

function setParserPassword(password) {
    if (password && password.length >= 6) {
        localStorage.setItem('parserPassword', password);
        return true;
    }
    return false;
}

// Автоматическое добавление товаров с официальных сайтов
async function autoAddProducts(brand) {
    if (!checkAuth()) return;
    
    const brandName = brand === 'nike' ? 'Nike' : 'Adidas';
    const confirmMsg = `${brandName} тауарларын ресми сайттан автоматты түрде қосу керек пе?`;
    
    if (!confirm(confirmMsg)) return;
    
    // Показываем прогресс
    const progressDiv = document.getElementById('scrapingProgress');
    const titleEl = document.getElementById('scrapingTitle');
    const statusTextEl = document.getElementById('scrapingStatusText');
    const percentEl = document.getElementById('scrapingPercent');
    const progressBarEl = document.getElementById('scrapingProgressBar');
    const scrapedCountEl = document.getElementById('scrapedCount');
    const addedCountEl = document.getElementById('addedCount');
    const duplicateCountEl = document.getElementById('duplicateCount');
    const logEl = document.getElementById('scrapingLog');
    
    if (progressDiv) progressDiv.style.display = 'block';
    if (titleEl) titleEl.textContent = `${brandName} тауарларын қосу...`;
    if (statusTextEl) statusTextEl.textContent = 'Басталуда...';
    if (logEl) logEl.innerHTML = '<div style="color: var(--text-light);">🚀 Процесс басталды...</div>';
    if (scrapedCountEl) scrapedCountEl.textContent = '0';
    if (addedCountEl) addedCountEl.textContent = '0';
    if (duplicateCountEl) duplicateCountEl.textContent = '0';
    
    // Отключаем кнопки
    const nikeBtn = document.getElementById('autoAddNikeBtn');
    const adidasBtn = document.getElementById('autoAddAdidasBtn');
    if (nikeBtn) nikeBtn.disabled = true;
    if (adidasBtn) adidasBtn.disabled = true;
    
    let totalScraped = 0;
    let totalAdded = 0;
    let totalDuplicates = 0;
    
    try {
        updateProgress(0, 'Сайттардан деректерді алу...', logEl);
        
        const products = await scrapeBrandProducts(brand, (progress, status, log) => {
            updateProgress(progress, status, logEl);
            if (log) addLog(logEl, log);
        });
        
        totalScraped = products.length;
        if (scrapedCountEl) scrapedCountEl.textContent = totalScraped;
        
        if (products.length === 0) {
            updateProgress(100, 'Тауарлар табылмады', logEl);
            addLog(logEl, '⚠️ Тауарлар табылмады', 'error');
            if (nikeBtn) nikeBtn.disabled = false;
            if (adidasBtn) adidasBtn.disabled = false;
            return;
        }
        
        updateProgress(50, 'Тауарларды сайтқа қосу...', logEl);
        addLog(logEl, `✅ Табылды: ${products.length} тауар`, 'success');
        
        // Автоматически добавляем на сайт
        const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
        const existingSet = new Set();
        existingProducts.forEach(p => {
            const key = p.name.toLowerCase().trim() + '_' + p.price;
            existingSet.add(key);
        });
        
        let maxId = existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.id)) : 0;
        let addedCount = 0;
        let duplicateCount = 0;
        
        products.forEach((product, index) => {
            try {
                const key = product.name.toLowerCase().trim() + '_' + product.price;
                if (!existingSet.has(key)) {
                    maxId++;
                    // Создаем описание с переводом на казахский
                    const description = createDescription(product.name, product.category, product.gender);
                    
                    existingProducts.push({
                        id: maxId,
                        name: product.name,
                        description: description,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        gender: product.gender,
                        brand: product.brand || brand // Сохраняем бренд для сортировки
                    });
                    existingSet.add(key);
                    addedCount++;
                    totalAdded++;
                    
                    // Обновляем счетчик каждые 5 товаров
                    if (addedCount % 5 === 0 || index === products.length - 1) {
                        if (addedCountEl) addedCountEl.textContent = totalAdded;
                        const progress = 50 + Math.round((index + 1) / products.length * 50);
                        updateProgress(progress, `Қосылуда: ${addedCount}/${products.length}`, logEl);
                    }
                } else {
                    duplicateCount++;
                    totalDuplicates++;
                    if (duplicateCountEl) duplicateCountEl.textContent = totalDuplicates;
                }
            } catch (e) {
                addLog(logEl, `⚠️ Қате: ${product.name}`, 'error');
            }
        });
        
        localStorage.setItem('products', JSON.stringify(existingProducts));
        loadProducts();
        
        updateProgress(100, '✅ Аяқталды!', logEl);
        addLog(logEl, `✅ Қосылды: ${addedCount} тауар`, 'success');
        if (duplicateCount > 0) {
            addLog(logEl, `⚠️ Дубликаттар: ${duplicateCount}`, 'warning');
        }
        
        if (titleEl) titleEl.textContent = `✅ ${brandName}: ${addedCount} тауар қосылды!`;
        if (statusTextEl) statusTextEl.textContent = 'Аяқталды';
        
        let message = `${brandName}: ${addedCount} тауар қосылды`;
        if (duplicateCount > 0) {
            message += `, ${duplicateCount} дубликат`;
        }
        showNotification(message, 'success');
        
    } catch (error) {
        updateProgress(100, '❌ Қате', logEl);
        addLog(logEl, `❌ Қате: ${error.message}`, 'error');
        if (titleEl) titleEl.textContent = '❌ Қате орын алды';
        showNotification(`Қате: ${error.message}`, 'error');
    } finally {
        if (nikeBtn) nikeBtn.disabled = false;
        if (adidasBtn) adidasBtn.disabled = false;
        
        // Скрываем прогресс через 10 секунд
        setTimeout(() => {
            if (progressDiv) progressDiv.style.display = 'none';
        }, 10000);
    }
}

function updateProgress(percent, status, logEl) {
    const progressBarEl = document.getElementById('scrapingProgressBar');
    const percentEl = document.getElementById('scrapingPercent');
    const statusTextEl = document.getElementById('scrapingStatusText');
    
    if (progressBarEl) {
        progressBarEl.style.width = percent + '%';
        progressBarEl.textContent = percent + '%';
    }
    if (percentEl) percentEl.textContent = percent + '%';
    if (statusTextEl) statusTextEl.textContent = status;
}

function addLog(logEl, message, type = 'info') {
    if (!logEl) return;
    
    const colors = {
        'info': '#2196F3',
        'success': '#4CAF50',
        'warning': '#ff9800',
        'error': '#f44336'
    };
    
    const item = document.createElement('div');
    item.style.marginBottom = '0.5rem';
    item.style.color = colors[type] || colors.info;
    item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEl.appendChild(item);
    logEl.scrollTop = logEl.scrollHeight;
}

// Скрапинг товаров с официальных сайтов
async function scrapeBrandProducts(brand, progressCallback) {
    const products = [];
    const urls = [];
    
    if (brand === 'nike') {
        // Nike официальный сайт - мужские товары (все категории)
        // New Arrivals, Best Sellers, Latest Drops
        urls.push('https://www.nike.com/w/mens-new-arrivals');
        urls.push('https://www.nike.com/w/mens-best-sellers');
        urls.push('https://www.nike.com/w/mens-latest-drops');
        
        // Shoes - все подкатегории
        urls.push('https://www.nike.com/w/mens-shoes-nik1zy7ok'); // All Shoes
        urls.push('https://www.nike.com/w/mens-basketball-shoes-3glsmznik1zy7ok'); // Basketball
        urls.push('https://www.nike.com/w/mens-jordan-shoes-37eefznik1zy7ok'); // Jordan
        urls.push('https://www.nike.com/w/mens-lifestyle-shoes-13jrmznik1zy7ok'); // Lifestyle
        urls.push('https://www.nike.com/w/mens-retro-running-shoes-3glsmznik1zy7ok'); // Retro Running
        urls.push('https://www.nike.com/w/mens-running-shoes-37v7jznik1zy7ok'); // Running
        urls.push('https://www.nike.com/w/mens-shoes-under-100-3glsmznik1zy7ok'); // Shoes $100 & Under
        urls.push('https://www.nike.com/w/mens-training-gym-shoes-37v7jznik1zy7ok'); // Training & Gym
        
        // Clothing - все подкатегории
        urls.push('https://www.nike.com/w/mens-clothing-6ymx6'); // All Clothing
        urls.push('https://www.nike.com/w/mens-hoodies-sweatshirts-6ymx6z37v7j'); // Hoodies & Sweatshirts
        urls.push('https://www.nike.com/w/mens-jordan-clothing-37eefz6ymx6'); // Jordan
        urls.push('https://www.nike.com/w/mens-matching-sets-6ymx6z37v7j'); // Matching Sets
        urls.push('https://www.nike.com/w/mens-outerwear-6ymx6z37v7j'); // Outerwear
        urls.push('https://www.nike.com/w/mens-pants-6ymx6z37v7j'); // Pants
        urls.push('https://www.nike.com/w/mens-shorts-6ymx6z37v7j'); // Shorts
        urls.push('https://www.nike.com/w/mens-sweatpants-6ymx6z37v7j'); // Sweatpants
        urls.push('https://www.nike.com/w/mens-tops-graphic-tees-6ymx6z37v7j'); // Tops & Graphic Tees
        urls.push('https://www.nike.com/w/mens-247-collection-6ymx6z37v7j'); // 24.7 Collection
        
        // Accessories
        urls.push('https://www.nike.com/w/mens-accessories-equipment-6ymx6zawwpw'); // Accessories
        urls.push('https://www.nike.com/w/mens-bags-backpacks-6ymx6zawwpw'); // Bags & Backpacks
        urls.push('https://www.nike.com/w/mens-belts-6ymx6zawwpw'); // Belts
        urls.push('https://www.nike.com/w/mens-hats-headwear-6ymx6zawwpw'); // Hats & Headwear
        urls.push('https://www.nike.com/w/mens-socks-6ymx6zawwpw'); // Socks
        urls.push('https://www.nike.com/w/mens-sunglasses-6ymx6zawwpw'); // Sunglasses
        urls.push('https://www.nike.com/w/mens-underwear-6ymx6zawwpw'); // Underwear
        urls.push('https://www.nike.com/w/mens-recovery-collection-6ymx6zawwpw'); // Recovery Collection
    } else if (brand === 'adidas') {
        urls.push('https://www.adidas.com/kz/women-shoes');
        urls.push('https://www.adidas.com/kz/women-clothing');
        urls.push('https://www.adidas.com/kz/men-shoes');
        urls.push('https://www.adidas.com/kz/men-clothing');
    }
    
    const totalUrls = urls.length;
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const progress = Math.round((i / totalUrls) * 50);
        const categoryName = url.includes('women') || url.includes('womens') ? 'Әйелдер' : 'Ерлер';
        const itemType = url.includes('shoe') || url.includes('shoes') ? 'Аяқ киім' : 'Киім';
        
        if (progressCallback) {
            progressCallback(progress, `${categoryName} - ${itemType} (${i + 1}/${totalUrls})`, null);
        }
        
        try {
            const gender = url.includes('women') || url.includes('womens') ? 'women' : 'men';
            const pageProducts = await scrapeUrl(url, brand, gender, (msg) => {
                if (progressCallback) {
                    progressCallback(progress, `${categoryName} - ${itemType}`, msg);
                }
            });
            products.push(...pageProducts);
            
            if (progressCallback) {
                progressCallback(progress, `${categoryName} - ${itemType}: ${pageProducts.length} тауар`, null);
            }
            
            await delay(2000); // Задержка между запросами
        } catch (error) {
            console.error(`Ошибка скрапинга ${url}:`, error);
            if (progressCallback) {
                progressCallback(progress, `⚠️ Қате: ${url}`, `Қате: ${error.message}`);
            }
        }
    }
    
    return products;
}

async function scrapeUrl(url, brand, gender, logCallback) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        // Более агрессивные настройки для обхода CORS
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        iframe.setAttribute('crossorigin', 'anonymous');
        document.body.appendChild(iframe);
        
        const products = [];
        let scrapedCount = 0;
        
        if (logCallback) logCallback('Сайтты жүктеу...');
        
        iframe.onload = function() {
            if (logCallback) logCallback('✅ Сайт жүктелді, деректерді алу...');
            
            setTimeout(() => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    if (!iframeDoc) {
                        if (logCallback) logCallback('⚠️ CORS шектеулері - браузер консольінде скриптті қолданыңыз');
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                        resolve([]);
                        return;
                    }
                    
                    // Расширенные селекторы для Nike и Adidas
                    const selectors = brand === 'nike' 
                        ? [
                            '[data-testid="product-card"]',
                            '[data-testid*="product"]',
                            '.product-card',
                            '[class*="ProductCard"]',
                            '[class*="product-card"]',
                            '[class*="product-tile"]',
                            '[class*="product"]',
                            'article[class*="product"]',
                            '[data-product-id]',
                            '[data-product]',
                            'div[class*="product"]',
                            'a[href*="/product/"]',
                            'a[href*="/t/"]',
                            '[class*="ProductTile"]',
                            '[class*="product-tile"]'
                          ]
                        : [
                            '[class*="product-tile"]',
                            '[data-testid="plp-product-tile"]',
                            '[class*="product-tile-wrapper"]',
                            '[class*="product"]',
                            'article',
                            '[class*="ProductTile"]',
                            '[data-testid*="product"]'
                          ];
                    
                    let elements = [];
                    selectors.forEach(selector => {
                        try {
                            const els = iframeDoc.querySelectorAll(selector);
                            if (els.length > 0) {
                                if (elements.length === 0 || els.length > elements.length) {
                                    elements = Array.from(els);
                                    if (logCallback) logCallback(`✅ Табылды: ${els.length} элемент (${selector})`);
                                }
                            }
                        } catch (e) {
                            // Игнорируем ошибки селекторов
                        }
                    });
                    
                    if (elements.length === 0) {
                        // Пробуем более общие селекторы
                        try {
                            const allElements = iframeDoc.querySelectorAll('article, [class*="card"], [class*="tile"], [data-testid*="product"], a[href*="/product/"], a[href*="/t/"], [class*="Product"], div[role="listitem"]');
                            elements = Array.from(allElements);
                            if (logCallback) logCallback(`✅ Табылды (жалпы): ${elements.length} элемент`);
                        } catch (e) {
                            if (logCallback) logCallback(`⚠️ Селектор қатесі: ${e.message}`);
                        }
                    }
                    
                    if (elements.length === 0) {
                        if (logCallback) logCallback('⚠️ Тауарлар табылмады - сайт структурасы өзгерген болуы мүмкін');
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                        resolve([]);
                        return;
                    }
                    
                    if (logCallback) logCallback(`Скрапинг: ${elements.length} элемент...`);
                    
                    elements.forEach((el, index) => {
                        try {
                            // Название - расширенный поиск
                            const nameSelectors = [
                                'h3', 'h4', 'h2', 'h1',
                                '[class*="title"]',
                                '[class*="name"]',
                                '[data-testid*="product-name"]',
                                '[data-testid*="product-title"]',
                                '[class*="ProductCard-title"]',
                                '[class*="product-title"]',
                                '[class*="ProductTile-title"]',
                                'a[href*="/product/"]',
                                'a[href*="/t/"]',
                                '[aria-label]'
                            ];
                            
                            let name = '';
                            for (const selector of nameSelectors) {
                                const nameEl = el.querySelector(selector);
                                if (nameEl) {
                                    name = nameEl.textContent.trim() || nameEl.getAttribute('aria-label') || '';
                                    if (name && name.length > 3) break;
                                }
                            }
                            
                            if (!name) {
                                name = el.getAttribute('data-name') || 
                                       el.getAttribute('title') || 
                                       el.getAttribute('aria-label') ||
                                       el.textContent.trim().substring(0, 100) || '';
                            }
                            
                            if (!name || name.length < 3) {
                                return;
                            }
                            
                            // УБИРАЕМ СТРОГУЮ ПРОВЕРКУ НА БРЕНД - ресми сайттарда бренд атауында болмауы мүмкін!
                            // if (brand === 'nike' && !nameLower.includes('nike')) return;
                            // if (brand === 'adidas' && !nameLower.includes('adidas')) return;
                            
                            // Цена - расширенный поиск
                            const priceSelectors = [
                                '[class*="price"]',
                                '[class*="Price"]',
                                '[data-testid*="price"]',
                                '[data-testid*="Price"]',
                                '[class*="product-price"]',
                                '[class*="current-price"]',
                                '[class*="final-price"]',
                                '[itemprop="price"]',
                                '[data-price]',
                                '[class*="ProductPrice"]'
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
                            
                            // Если цена не найдена, пробуем найти в родительских элементах
                            if (price === 0) {
                                let parent = el.parentElement;
                                let depth = 0;
                                while (parent && depth < 3) {
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
                            
                            if (price < 1000) {
                                if (logCallback && index < 10) logCallback(`⚠️ Баға табылмады: ${name.substring(0, 30)}...`);
                                return;
                            }
                            
                            // Изображение
                            const imgEl = el.querySelector('img');
                            let image = '';
                            if (imgEl) {
                                image = imgEl.src || 
                                       imgEl.dataset.src || 
                                       imgEl.getAttribute('data-lazy-src') || 
                                       imgEl.getAttribute('data-original') ||
                                       imgEl.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0] ||
                                       '';
                                if (image && image.startsWith('//')) {
                                    image = 'https:' + image;
                                } else if (image && image.startsWith('/')) {
                                    if (url.includes('nike.com')) {
                                        image = 'https://www.nike.com' + image;
                                    } else if (url.includes('adidas.com')) {
                                        image = 'https://www.adidas.com' + image;
                                    }
                                }
                            }
                            
                            // Определяем категорию по URL и названию
                            let category = 'sneakers';
                            const urlLower = url.toLowerCase();
                            const nameLower2 = name.toLowerCase();
                            
                            if (urlLower.includes('shoe') || urlLower.includes('basketball') || urlLower.includes('jordan') || 
                                urlLower.includes('running') || urlLower.includes('training') || urlLower.includes('lifestyle') ||
                                nameLower2.includes('shoe') || nameLower2.includes('кроссовк') || nameLower2.includes('sneaker')) {
                                category = 'sneakers';
                            } else if (urlLower.includes('hoodie') || urlLower.includes('sweatshirt') || urlLower.includes('top') || 
                                      urlLower.includes('graphic') || urlLower.includes('tee') || urlLower.includes('shirt') ||
                                      nameLower2.includes('shirt') || nameLower2.includes('hoodie') || nameLower2.includes('худи') || 
                                      nameLower2.includes('футболк') || nameLower2.includes('топ') || nameLower2.includes('свитшот')) {
                                category = 'shirts';
                            } else if (urlLower.includes('pant') || urlLower.includes('sweatpant') || urlLower.includes('trouser') ||
                                      nameLower2.includes('pant') || nameLower2.includes('брюк') || nameLower2.includes('шалбар') ||
                                      nameLower2.includes('джоггер') || nameLower2.includes('sweatpant')) {
                                category = 'pants';
                            } else if (urlLower.includes('outerwear') || urlLower.includes('jacket') || urlLower.includes('coat') ||
                                      nameLower2.includes('jacket') || nameLower2.includes('куртк') || nameLower2.includes('жакет') ||
                                      nameLower2.includes('пальт') || nameLower2.includes('ветровк') || nameLower2.includes('coat')) {
                                category = 'jackets';
                            } else if (urlLower.includes('short') || nameLower2.includes('short') || nameLower2.includes('шорт')) {
                                category = 'pants';
                            } else if (urlLower.includes('accessor') || urlLower.includes('bag') || urlLower.includes('belt') ||
                                      urlLower.includes('hat') || urlLower.includes('sock') || urlLower.includes('sunglass') ||
                                      urlLower.includes('underwear') || urlLower.includes('recovery')) {
                                category = 'shirts';
                            }
                            
                            // Переводим название
                            const translatedName = translateProductName(name, brand);

                            // Размер
                            const sizeSelectors = ['[class*="size"]', '[data-size]', '[class*="Size"]', '.size-value', '[aria-label*="size"]'];
                            let size = '';
                            for (const selector of sizeSelectors) {
                                const sizeEl = el.querySelector(selector);
                                if (sizeEl) {
                                    size = sizeEl.textContent.trim() || sizeEl.getAttribute('data-size') || sizeEl.getAttribute('aria-label') || '';
                                    if (size) break;
                                }
                            }

                            // Модель (из названия или атрибутов)
                            let model = '';
                            const modelMatch = name.match(/(Air Max|Air Force|Dunk|Jordan|Ultraboost|Yeezy|Stan Smith|Superstar|[A-Z]{2,}\d+)/i);
                            if (modelMatch) {
                                model = modelMatch[1];
                            } else {
                                model = name.split(' ').slice(0, 2).join(' '); // Первые два слова как модель
                            }
                            
                            products.push({
                                name: translatedName,
                                price: price,
                                image: image,
                                category: category,
                                gender: gender,
                                size: size,
                                model: model
                            });
                            scrapedCount++;
                            
                            if (scrapedCount % 10 === 0 && logCallback) {
                                logCallback(`Скрапингтелді: ${scrapedCount} тауар...`);
                            }
                        } catch (e) {
                            if (logCallback && index < 10) {
                                logCallback(`⚠️ Қате: ${e.message}`);
                            }
                        }
                    });
                    
                    if (logCallback) logCallback(`✅ Скрапингтелді: ${scrapedCount} тауар`);
                    
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                    resolve(products);
                } catch (error) {
                    if (logCallback) logCallback(`❌ Қате: ${error.message}`);
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                    resolve([]);
                }
            }, 10000); // Увеличиваем время ожидания для загрузки контента
        };
        
        iframe.onerror = function() {
            if (logCallback) logCallback('❌ Сайтты жүктеу қатесі');
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
            resolve([]);
        };
        
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
            if (logCallback) logCallback('⚠️ Уақыт аяқталды (15 секунд)');
            resolve([]);
        }, 25000); // Увеличиваем таймаут до 25 секунд
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Перевод названий товаров на русский и казахский
function translateProductName(name, brand) {
    const nameLower = name.toLowerCase();
    let translated = name;
    
    // Основные слова для перевода
    const translations = {
        // Обувь
        'shoe': 'Кроссовки',
        'sneaker': 'Кроссовки',
        'sneakers': 'Кроссовки',
        'running': 'Беговые',
        'basketball': 'Баскетбольные',
        'training': 'Тренировочные',
        'lifestyle': 'Повседневные',
        'air max': 'Air Max',
        'air force': 'Air Force',
        'dunk': 'Dunk',
        'ultraboost': 'Ultraboost',
        'yeezy': 'Yeezy',
        'stan smith': 'Stan Smith',
        'superstar': 'Superstar',
        
        // Одежда
        'shirt': 'Футболка',
        't-shirt': 'Футболка',
        'hoodie': 'Худи',
        'sweatshirt': 'Свитшот',
        'jacket': 'Куртка',
        'pants': 'Брюки',
        'trousers': 'Брюки',
        'shorts': 'Шорты',
        'joggers': 'Джоггеры',
        'track': 'Спортивные',
        'sport': 'Спортивные',
        
        // Женские
        'women': 'Женские',
        "women's": 'Женские',
        'womens': 'Женские',
        
        // Мужские
        'men': 'Мужские',
        "men's": 'Мужские',
        'mens': 'Мужские',
        
        // Цвета
        'black': 'Черный',
        'white': 'Белый',
        'red': 'Красный',
        'blue': 'Синий',
        'green': 'Зеленый',
        'gray': 'Серый',
        'grey': 'Серый',
        'pink': 'Розовый',
        'orange': 'Оранжевый',
        'yellow': 'Желтый',
        'purple': 'Фиолетовый',
        'brown': 'Коричневый',
        'navy': 'Темно-синий',
        'beige': 'Бежевый',
        
        // Размеры и модели
        'low': 'Низкие',
        'high': 'Высокие',
        'mid': 'Средние',
        'pro': 'Pro',
        'plus': 'Plus',
        'max': 'Max',
        'boost': 'Boost',
        'react': 'React',
        'zoom': 'Zoom',
        'air': 'Air'
    };
    
    // Переводим основные слова
    let result = name;
    for (const [en, ru] of Object.entries(translations)) {
        const regex = new RegExp(`\\b${en}\\b`, 'gi');
        result = result.replace(regex, ru);
    }
    
    // Добавляем бренд если его нет
    if (brand === 'nike' && !result.toLowerCase().includes('nike')) {
        result = 'Nike ' + result;
    } else if (brand === 'adidas' && !result.toLowerCase().includes('adidas')) {
        result = 'Adidas ' + result;
    }
    
    // Казахский перевод (основные слова)
    const kazakhTranslations = {
        'Кроссовки': 'Кроссовки',
        'Футболка': 'Футболка',
        'Худи': 'Худи',
        'Свитшот': 'Свитшот',
        'Куртка': 'Жакет',
        'Брюки': 'Шалбар',
        'Шорты': 'Шорты',
        'Женские': 'Әйелдер',
        'Мужские': 'Ерлер',
        'Черный': 'Қара',
        'Белый': 'Ақ',
        'Красный': 'Қызыл',
        'Синий': 'Көк',
        'Зеленый': 'Жасыл',
        'Серый': 'Сұр',
        'Розовый': 'Қызғылт',
        'Оранжевый': 'Қызғылт сары',
        'Желтый': 'Сары',
        'Фиолетовый': 'Күлгін',
        'Коричневый': 'Қоңыр',
        'Темно-синий': 'Қара көк',
        'Бежевый': 'Беж'
    };
    
    // Для казахского добавляем в скобках (можно использовать для описания)
    // Но название оставляем на русском для единообразия
    
    return result;
}

// Создание описания с переводом на казахский
function createDescription(name, category, gender) {
    const categoryKz = {
        'sneakers': 'Кроссовки',
        'shirts': 'Футболка',
        'pants': 'Шалбар',
        'jackets': 'Жакет'
    };
    
    const genderKz = {
        'women': 'Әйелдерге арналған',
        'men': 'Ерлерге арналған'
    };
    
    const categoryRu = {
        'sneakers': 'Кроссовки',
        'shirts': 'Футболка',
        'pants': 'Брюки',
        'jackets': 'Куртка'
    };
    
    const genderRu = {
        'women': 'Женские',
        'men': 'Мужские'
    };
    
    const categoryNameKz = categoryKz[category] || 'Киім';
    const categoryNameRu = categoryRu[category] || 'Одежда';
    const genderNameKz = genderKz[gender] || '';
    const genderNameRu = genderRu[gender] || '';
    
    return `${name}. ${categoryNameRu} ${genderNameRu}. 100% оригинал. Ресми баға + 10% наценка. ${categoryNameKz} ${genderNameKz}.`;
}

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    return isLoggedIn;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!checkAuth()) {
        showLoginModal();
    } else {
        showAdminContent();
        loadProducts();
        loadOrders();
        setupEventListeners();
        translatePage();
        updateLangButton();
    }
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const adminContent = document.getElementById('adminContent');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginModal) loginModal.classList.add('show');
    if (adminContent) adminContent.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
}

function showAdminContent() {
    const loginModal = document.getElementById('loginModal');
    const adminContent = document.getElementById('adminContent');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginModal) loginModal.classList.remove('show');
    if (adminContent) adminContent.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
}

function handleLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput ? passwordInput.value : '';
    const errorDiv = document.getElementById('loginError');
    
    if (!password) {
        if (errorDiv) {
            errorDiv.textContent = currentLang === 'kk' ? 'Парольді енгізіңіз!' : 'Введите пароль!';
            errorDiv.style.display = 'block';
        }
        if (passwordInput) passwordInput.focus();
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminContent();
        loadProducts();
        loadOrders();
        setupEventListeners();
        translatePage();
        updateLangButton();
        if (errorDiv) errorDiv.style.display = 'none';
        console.log('Успешный вход в админ панель');
    } else {
        if (errorDiv) {
            errorDiv.textContent = currentLang === 'kk' ? 'Қате пароль!' : 'Неверный пароль!';
            errorDiv.style.display = 'block';
        }
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
        console.log('Неверный пароль. Ожидается:', ADMIN_PASSWORD);
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    showLoginModal();
    document.getElementById('adminPassword').value = '';
    if (document.getElementById('loginError')) {
        document.getElementById('loginError').style.display = 'none';
    }
}

function setupEventListeners() {
    // Language switcher
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            openProductModal();
        });
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            closeProductModal();
        });
    }

    // Product modal close
    const productModal = document.getElementById('productModal');
    const productClose = productModal?.querySelector('.close');
    if (productClose) {
        productClose.addEventListener('click', () => {
            closeProductModal();
        });
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
        const importModal = document.getElementById('importModal');
        if (e.target === importModal) {
            closeImportModal();
        }
    });

    // Import products button
    const importProductsBtn = document.getElementById('importProductsBtn');
    if (importProductsBtn) {
        importProductsBtn.addEventListener('click', () => {
            openImportModal();
        });
    }

    // Export products button
    const exportProductsBtn = document.getElementById('exportProductsBtn');
    if (exportProductsBtn) {
        exportProductsBtn.addEventListener('click', () => {
            exportProducts();
        });
    }

    // Import form
    const importForm = document.getElementById('importForm');
    if (importForm) {
        importForm.addEventListener('submit', handleImportSubmit);
    }
}

let selectMode = false;
let selectedProducts = new Set();

async function loadProducts() {
    let products = [];
    try {
        products = await api.getProducts();
    } catch (error) {
        console.error('Error loading products from API, falling back to localStorage:', error);
        products = JSON.parse(localStorage.getItem('products')) || [];
    }
    
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (products.length === 0) {
        const colspan = selectMode ? 7 : 6;
        tableBody.innerHTML = `
            <tr>
                <td colspan="${colspan}" style="text-align: center; color: var(--text-light); padding: 2rem;">
                    ${currentLang === 'kk' ? 'Өнімдер жоқ' : 'Нет товаров'}
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.id = `product-row-${product.id}`;
        const categoryName = getCategoryName(product.category || '');
        const genderName = getGenderName(product.gender || '');
        const isSelected = selectedProducts.has(product.id);
        
        row.innerHTML = `
            <td class="select-cell" style="display: ${selectMode ? 'table-cell' : 'none'};">
                <input type="checkbox" class="product-checkbox" data-product-id="${product.id}" 
                       ${isSelected ? 'checked' : ''} onchange="toggleProductSelection(${product.id})">
            </td>
            <td>
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}" class="table-image">`
                    : '<div class="table-image-placeholder">👟</div>'
                }
            </td>
            <td><strong>${product.name}</strong></td>
            <td><span class="category-badge">${categoryName}</span></td>
            <td><span class="gender-badge" style="background: ${product.gender === 'women' ? '#ff6b9d' : '#4dabf7'}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">${genderName}</span></td>
            <td><strong>${formatPrice(product.price)}</strong></td>
            <td>
                <div class="table-actions" style="display: ${selectMode ? 'none' : 'flex'};">
                    <button class="btn-edit" onclick="editProduct(${product.id})" data-translate="admin.edit">Өзгерту</button>
                    <button class="btn-danger" onclick="deleteProduct(${product.id})" data-translate="admin.delete">Жою</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    translatePage();
}

function toggleSelectMode() {
    selectMode = !selectMode;
    const selectAllHeader = document.getElementById('selectAllHeader');
    const selectDeleteBtn = document.getElementById('selectDeleteBtn');
    const cancelSelectBtn = document.getElementById('cancelSelectBtn');
    const selectCells = document.querySelectorAll('.select-cell');
    const actionCells = document.querySelectorAll('.table-actions');
    
    if (selectMode) {
        selectAllHeader.style.display = 'table-cell';
        selectDeleteBtn.style.display = 'inline-block';
        cancelSelectBtn.style.display = 'inline-block';
        const startSelectBtn = document.getElementById('startSelectBtn');
        if (startSelectBtn) startSelectBtn.style.display = 'none';
        selectCells.forEach(cell => cell.style.display = 'table-cell');
        actionCells.forEach(cell => cell.style.display = 'none');
        selectedProducts.clear();
        updateSelectedCount();
    } else {
        selectAllHeader.style.display = 'none';
        selectDeleteBtn.style.display = 'none';
        cancelSelectBtn.style.display = 'none';
        const startSelectBtn = document.getElementById('startSelectBtn');
        if (startSelectBtn) startSelectBtn.style.display = 'inline-block';
        selectCells.forEach(cell => cell.style.display = 'none');
        actionCells.forEach(cell => cell.style.display = 'flex');
        selectedProducts.clear();
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        updateSelectedCount();
    }
    
    loadProducts();
}

function cancelSelectMode() {
    selectMode = false;
    selectedProducts.clear();
    toggleSelectMode();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (selectAllCheckbox.checked) {
        products.forEach(p => selectedProducts.add(p.id));
        checkboxes.forEach(cb => cb.checked = true);
    } else {
        selectedProducts.clear();
        checkboxes.forEach(cb => cb.checked = false);
    }
    
    updateSelectedCount();
}

function toggleProductSelection(productId) {
    const checkbox = document.querySelector(`.product-checkbox[data-product-id="${productId}"]`);
    if (checkbox.checked) {
        selectedProducts.add(productId);
    } else {
        selectedProducts.delete(productId);
    }
    
    // Обновляем счетчик
    updateSelectedCount();
    
    // Обновляем "Выбрать все"
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selectedProducts.size === products.length;
    }
}

function updateSelectedCount() {
    const selectedCountEl = document.getElementById('selectedCount');
    if (selectedCountEl) {
        selectedCountEl.textContent = selectedProducts.size;
    }
}

async function deleteSelectedProducts() {
    if (selectedProducts.size === 0) {
        alert(currentLang === 'kk' ? 'Тауарлар таңдалмаған!' : 'Товары не выбраны!');
        return;
    }
    
    const confirmMsg = currentLang === 'kk' 
        ? `Таңдалған ${selectedProducts.size} тауарды жою керек пе?`
        : `Удалить выбранные ${selectedProducts.size} товаров?`;
    
    if (!confirm(confirmMsg)) return;
    
    try {
        const ids = Array.from(selectedProducts);
        await api.deleteProducts(ids);
        // Обновляем localStorage
        const currentProducts = await api.getProducts();
        localStorage.setItem('products', JSON.stringify(currentProducts));
        // Обновляем главную страницу если открыта
        if (window.opener) {
            try {
                window.opener.localStorage.setItem('products', JSON.stringify(currentProducts));
                window.opener.location.reload();
            } catch (e) {}
        }
        selectedProducts.clear();
        toggleSelectMode();
        await loadProducts();
        showNotification(currentLang === 'kk' ? 'Тауарлар жойылды' : 'Товары удалены');
    } catch (error) {
        console.error('Error deleting products:', error);
        // Fallback to localStorage
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const filteredProducts = products.filter(p => !selectedProducts.has(p.id));
        localStorage.setItem('products', JSON.stringify(filteredProducts));
        if (window.opener) {
            try {
                window.opener.localStorage.setItem('products', JSON.stringify(filteredProducts));
                window.opener.location.reload();
            } catch (e) {}
        }
        selectedProducts.clear();
        toggleSelectMode();
        loadProducts();
        showNotification(currentLang === 'kk' ? 'Тауарлар жойылды' : 'Товары удалены');
    }
}

async function deleteAllProducts() {
    let products = [];
    try {
        products = await api.getProducts();
    } catch (error) {
        products = JSON.parse(localStorage.getItem('products')) || [];
    }
    
    if (products.length === 0) {
        alert(currentLang === 'kk' ? 'Тауарлар жоқ!' : 'Товаров нет!');
        return;
    }
    
    const confirmMsg = currentLang === 'kk' 
        ? `Барлық ${products.length} тауарды жою керек пе? Бұл әрекетті қайтару мүмкін емес!`
        : `Удалить все ${products.length} товаров? Это действие нельзя отменить!`;
    
    if (!confirm(confirmMsg)) return;
    
    // Двойное подтверждение для безопасности
    const doubleConfirm = currentLang === 'kk'
        ? 'Сіз шынымен барлық тауарларды жойғыңыз келе ме?'
        : 'Вы действительно хотите удалить ВСЕ товары?';
    
    if (!confirm(doubleConfirm)) return;
    
    try {
        const ids = products.map(p => p.id);
        await api.deleteProducts(ids);
        // Очищаем localStorage на всех вкладках
        localStorage.removeItem('products');
        // Отправляем событие для обновления главной страницы
        if (window.opener) {
            try {
                window.opener.localStorage.removeItem('products');
                window.opener.location.reload();
            } catch (e) {}
        }
        // Обновляем текущую страницу админ панели
        await loadProducts();
        showNotification(currentLang === 'kk' ? 'Барлық тауарлар жойылды' : 'Все товары удалены', 'success');
    } catch (error) {
        console.error('Error deleting all products:', error);
        // Fallback to localStorage
        localStorage.setItem('products', JSON.stringify([]));
        if (window.opener) {
            try {
                window.opener.localStorage.setItem('products', JSON.stringify([]));
                window.opener.location.reload();
            } catch (e) {}
        }
        loadProducts();
        showNotification(currentLang === 'kk' ? 'Барлық тауарлар жойылды' : 'Все товары удалены', 'success');
    }
}

async function loadOrders() {
    let orders = [];
    try {
        orders = await api.getOrders();
        // Transform API orders to match expected format
        orders = orders.map(order => ({
            id: order.id,
            date: order.created_at,
            customer: {
                name: order.name,
                phone: order.phone,
                address: order.address,
                comment: ''
            },
            items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
            total: order.total,
            status: order.status
        }));
    } catch (error) {
        console.error('Error loading orders from API, falling back to localStorage:', error);
        orders = JSON.parse(localStorage.getItem('orders')) || [];
    }
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <p data-translate="admin.noOrders">Тапсырыстар жоқ</p>
            </div>
        `;
        translatePage();
        return;
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const itemsList = order.items.map(item => 
            `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
        ).join('<br>');

        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">${currentLang === 'kk' ? 'Тапсырыс' : 'Заказ'} #${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
            </div>
            <div class="order-info">
                <div class="order-info-item">
                    <div class="order-info-label">${currentLang === 'kk' ? 'Аты-жөні' : 'Имя'}</div>
                    <div class="order-info-value">${order.customer.name}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-info-label">${currentLang === 'kk' ? 'Телефон' : 'Телефон'}</div>
                    <div class="order-info-value">${order.customer.phone}</div>
                </div>
                ${order.customer.address ? `
                <div class="order-info-item">
                    <div class="order-info-label">${currentLang === 'kk' ? 'Мекен-жай' : 'Адрес'}</div>
                    <div class="order-info-value">${order.customer.address}</div>
                </div>
                ` : ''}
            </div>
            ${order.customer.comment ? `
            <div class="order-info-item" style="margin-top: 1rem;">
                <div class="order-info-label">${currentLang === 'kk' ? 'Түсініктеме' : 'Комментарий'}</div>
                <div class="order-info-value">${order.customer.comment}</div>
            </div>
            ` : ''}
            <div class="order-items">
                <div class="order-info-label" style="margin-bottom: 0.5rem;">${currentLang === 'kk' ? 'Тауарлар:' : 'Товары:'}</div>
                <div style="color: var(--text-light);">${itemsList}</div>
            </div>
            <div class="order-total">
                ${currentLang === 'kk' ? 'Жалпы:' : 'Итого:'} ${formatPrice(order.total)}
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (!modal || !form) return;

    if (productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productCategory').value = product.category || 'sneakers';
            document.getElementById('productGender').value = product.gender || 'women';
            document.getElementById('productModel').value = product.model || '';
            document.getElementById('productImages').value = (product.images && Array.isArray(product.images) ? product.images.join(', ') : '') || '';
            
            if (modalTitle) {
                modalTitle.setAttribute('data-translate', 'admin.editProduct');
            }
        }
    } else {
        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productCategory').value = 'sneakers';
        document.getElementById('productGender').value = 'women';
        document.getElementById('productModel').value = '';
        document.getElementById('productImages').value = '';
        if (modalTitle) {
            modalTitle.setAttribute('data-translate', 'admin.addProduct');
        }
    }

    modal.classList.add('show');
    translatePage();
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('productForm').reset();
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;
    const category = document.getElementById('productCategory').value;
    const gender = document.getElementById('productGender').value;
    const model = document.getElementById('productModel').value || '';
    const imagesText = document.getElementById('productImages').value || '';
    const images = imagesText.split(',').map(url => url.trim()).filter(url => url);
    const brand = document.getElementById('productBrand')?.value || '';

    if (!name || !description || !price || !category || !gender) {
        alert(currentLang === 'kk' ? 'Барлық өрістерді толтырыңыз' : 'Заполните все поля');
        return;
    }

    const productData = {
        name,
        description,
        price,
        image,
        category,
        gender,
        model,
        images: images.length > 0 ? images : undefined,
        brand
    };

    try {
        if (productId) {
            // Edit existing product
            await api.updateProduct(productId, productData);
        } else {
            // Add new product
            await api.createProduct(productData);
        }
        
        await loadProducts();
        closeProductModal();
        
        showNotification(currentLang === 'kk' ? 'Өнім сақталды' : 'Товар сохранен');
    } catch (error) {
        console.error('Error saving product:', error);
        // Fallback to localStorage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        if (productId) {
            const index = products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
            }
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({ id: newId, ...productData });
        }

        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        closeProductModal();
        showNotification(currentLang === 'kk' ? 'Өнім сақталды' : 'Товар сохранен');
    }
}

function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    if (!confirm(currentLang === 'kk' ? 'Өнімді жоюға сенімдісіз бе?' : 'Вы уверены, что хотите удалить товар?')) {
        return;
    }

    try {
        await api.deleteProduct(productId);
        // Обновляем localStorage
        const currentProducts = await api.getProducts();
        localStorage.setItem('products', JSON.stringify(currentProducts));
        // Обновляем главную страницу если открыта
        if (window.opener) {
            try {
                window.opener.localStorage.setItem('products', JSON.stringify(currentProducts));
                window.opener.location.reload();
            } catch (e) {}
        }
        await loadProducts();
        showNotification(currentLang === 'kk' ? 'Өнім жойылды' : 'Товар удален');
    } catch (error) {
        console.error('Error deleting product:', error);
        // Fallback to localStorage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        if (window.opener) {
            try {
                window.opener.localStorage.setItem('products', JSON.stringify(products));
                window.opener.location.reload();
            } catch (e) {}
        }
        loadProducts();
        showNotification(currentLang === 'kk' ? 'Өнім жойылды' : 'Товар удален');
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('kk-KZ', {
        style: 'currency',
        currency: 'KZT',
        minimumFractionDigits: 0
    }).format(price).replace('KZT', '₸');
}

function getCategoryName(category) {
    const names = {
        'sneakers': 'Кроссовки',
        'shirts': 'Жейде',
        'pants': 'Шалбар',
        'jackets': 'Жакет'
    };
    return names[category] || category;
}

function getGenderName(gender) {
    const names = {
        'women': 'Әйелдер',
        'men': 'Ерлер'
    };
    return names[gender] || gender;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Import/Export functions
function openImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.classList.add('show');
        document.getElementById('importForm').reset();
        document.getElementById('importMethod').value = 'excel';
        toggleImportMethod();
    }
}

function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.classList.remove('show');
        document.getElementById('importForm').reset();
    }
}

function toggleImportMethod() {
    const method = document.getElementById('importMethod').value;
    const excelFileGroup = document.getElementById('excelFileGroup');
    const jsonFileGroup = document.getElementById('jsonFileGroup');
    const jsonTextGroup = document.getElementById('jsonTextGroup');
    const localStorageGroup = document.getElementById('localStorageGroup');
    
    excelFileGroup.style.display = method === 'excel' ? 'block' : 'none';
    jsonFileGroup.style.display = method === 'json' ? 'block' : 'none';
    jsonTextGroup.style.display = method === 'text' ? 'block' : 'none';
    if (localStorageGroup) {
        localStorageGroup.style.display = method === 'localstorage' ? 'block' : 'none';
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const json = JSON.parse(e.target.result);
                document.getElementById('jsonText').value = JSON.stringify(json, null, 2);
            } catch (error) {
                alert(currentLang === 'kk' ? 'Файлды оқу қатесі' : 'Ошибка чтения файла');
            }
        };
        reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
        // CSV файл
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const csv = e.target.result;
                const json = parseCSV(csv);
                document.getElementById('jsonText').value = JSON.stringify(json, null, 2);
            } catch (error) {
                alert(currentLang === 'kk' ? 'CSV файлды оқу қатесі' : 'Ошибка чтения CSV файла');
            }
        };
        reader.readAsText(file);
    }
}

function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;
        
        const product = {};
        headers.forEach((header, index) => {
            product[header] = values[index] || '';
        });
        
        // Маппинг полей
        const mappedProduct = {
            name: product.name || product['название'] || product['атауы'] || '',
            description: product.description || product['описание'] || product['сипаттама'] || product.name || '',
            price: parseFloat(product.price || product['цена'] || product['баға'] || 0),
            image: product.image || product['изображение'] || product['сурет'] || '',
            category: mapCategory(product.category || product['категория'] || product['категория'] || ''),
            gender: mapGender(product.gender || product['пол'] || product['жыныс'] || '')
        };
        
        if (mappedProduct.name && mappedProduct.price > 0) {
            products.push(mappedProduct);
        }
    }
    
    return products;
}

// Импорт из localStorage (для скрипта из браузерной консоли)
function importFromLocalStorage() {
    try {
        // Ищем данные в localStorage
        let products = null;
        
        // Пробуем найти последние скрапленные товары
        const lastScraped = localStorage.getItem('last_scraped_products');
        if (lastScraped) {
            products = JSON.parse(lastScraped);
        } else {
            // Ищем по ключам
            const keys = Object.keys(localStorage);
            const scrapedKeys = keys.filter(k => k.startsWith('scraped_products_'));
            if (scrapedKeys.length > 0) {
                // Берем самый последний
                scrapedKeys.sort();
                const lastKey = scrapedKeys[scrapedKeys.length - 1];
                products = JSON.parse(localStorage.getItem(lastKey));
            }
        }
        
        if (!products || !Array.isArray(products) || products.length === 0) {
            alert(currentLang === 'kk' 
                ? 'localStorage-та тауарлар табылмады. Алдымен браузер консольінде скриптті орындаңыз.' 
                : 'Товары не найдены в localStorage. Сначала запустите скрипт в консоли браузера.');
            return;
        }
        
        const replaceExisting = document.getElementById('replaceExisting').checked;
        
        // Преобразуем формат данных
        const formattedProducts = products.map(p => {
            const description = createDescription(p.name, p.category, p.gender);
            return {
                name: translateProductName(p.name, p.brand || 'nike'),
                description: description,
                price: p.price,
                image: p.image,
                category: p.category || 'sneakers',
                gender: p.gender || 'men'
            };
        });
        
        importProducts(formattedProducts, replaceExisting);
        closeImportModal();
        
        // Очищаем localStorage после импорта
        localStorage.removeItem('last_scraped_products');
        const keys = Object.keys(localStorage);
        keys.filter(k => k.startsWith('scraped_products_')).forEach(k => localStorage.removeItem(k));
        
    } catch (error) {
        alert(currentLang === 'kk' 
            ? 'Импорт қатесі: ' + error.message 
            : 'Ошибка импорта: ' + error.message);
        console.error('Ошибка импорта из localStorage:', error);
    }
}

function handleImportSubmit(e) {
    e.preventDefault();
    
    const method = document.getElementById('importMethod').value;
    const replaceExisting = document.getElementById('replaceExisting').checked;
    
    if (method === 'localstorage') {
        importFromLocalStorage();
        return;
    }
    
    if (method === 'excel') {
        const file = document.getElementById('excelFile').files[0];
        if (!file) {
            alert(currentLang === 'kk' ? 'Файлды таңдаңыз' : 'Выберите файл');
            return;
        }
        
        if (file.name.endsWith('.csv')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const csv = e.target.result;
                    const jsonData = parseCSV(csv);
                    importProducts(jsonData, replaceExisting);
                } catch (error) {
                    alert(currentLang === 'kk' ? 'CSV қатесі: ' + error.message : 'Ошибка CSV: ' + error.message);
                }
            };
            reader.readAsText(file);
        } else {
            // Для .xlsx и .xls нужна библиотека, используем CSV или JSON
            alert(currentLang === 'kk' ? 'Excel файлды CSV форматына түрлендіріңіз немесе JSON пайдаланыңыз' : 'Конвертируйте Excel файл в CSV или используйте JSON');
        }
    } else if (method === 'json') {
        const file = document.getElementById('jsonFile').files[0];
        if (!file) {
            alert(currentLang === 'kk' ? 'Файлды таңдаңыз' : 'Выберите файл');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                importProducts(jsonData, replaceExisting);
            } catch (error) {
                alert(currentLang === 'kk' ? 'JSON қатесі: ' + error.message : 'Ошибка JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        const text = document.getElementById('jsonText').value;
        if (!text.trim()) {
            alert(currentLang === 'kk' ? 'JSON мәтінін енгізіңіз' : 'Введите JSON текст');
            return;
        }
        
        try {
            const jsonData = JSON.parse(text);
            importProducts(jsonData, replaceExisting);
        } catch (error) {
            alert(currentLang === 'kk' ? 'JSON қатесі: ' + error.message : 'Ошибка JSON: ' + error.message);
        }
    }
}

function importProducts(productsData, replaceExisting) {
    if (!Array.isArray(productsData)) {
        alert(currentLang === 'kk' ? 'Товарлар массиві болуы керек' : 'Данные должны быть массивом');
        return;
    }
    
    let existingProducts = JSON.parse(localStorage.getItem('products')) || [];
    
    if (replaceExisting) {
        existingProducts = [];
    }
    
    // Создаем Set для быстрой проверки дубликатов
    // Проверяем по названию (без учета регистра) и цене
    const existingProductsSet = new Set();
    existingProducts.forEach(p => {
        const key = `${p.name.toLowerCase().trim()}_${p.price}`;
        existingProductsSet.add(key);
    });
    
    let maxId = existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.id)) : 0;
    let importedCount = 0;
    let skippedCount = 0;
    let duplicateCount = 0;
    
    productsData.forEach(product => {
        // Validate required fields
        if (!product.name || !product.price || !product.category || !product.gender) {
            skippedCount++;
            return;
        }
        
        // Map category and gender if needed
        const category = mapCategory(product.category);
        const gender = mapGender(product.gender);
        
        if (!category || !gender) {
            skippedCount++;
            return;
        }
        
        // Проверяем на дубликаты
        const productName = (product.name || 'Товар').trim();
        const productPrice = parseFloat(product.price) || 0;
        const duplicateKey = `${productName.toLowerCase()}_${productPrice}`;
        
        if (existingProductsSet.has(duplicateKey)) {
            duplicateCount++;
            return; // Пропускаем дубликат
        }
        
        // Добавляем в Set, чтобы не добавлять дубликаты в рамках одного импорта
        existingProductsSet.add(duplicateKey);
        
        maxId++;
        const newProduct = {
            id: maxId,
            name: productName,
            description: product.description || productName || 'Сипаттама жоқ',
            price: productPrice,
            image: product.image || '',
            category: category,
            gender: gender,
            brand: product.brand || '' // Сохраняем бренд для сортировки
        };
        
        existingProducts.push(newProduct);
        importedCount++;
    });
    
    localStorage.setItem('products', JSON.stringify(existingProducts));
    loadProducts();
    closeImportModal();
    
    let message = (currentLang === 'kk' ? 'Импортталды: ' : 'Импортировано: ') + importedCount;
    
    if (duplicateCount > 0) {
        message += (currentLang === 'kk' ? ', Дубликаттар: ' : ', Дубликаты: ') + duplicateCount;
    }
    
    if (skippedCount > 0) {
        message += (currentLang === 'kk' ? ', Өткізілді: ' : ', Пропущено: ') + skippedCount;
    }
    
    showNotification(message);
}

function mapCategory(category) {
    const categoryMap = {
        'кроссовки': 'sneakers',
        'sneakers': 'sneakers',
        'обувь': 'sneakers',
        'обув': 'sneakers',
        'кросовки': 'sneakers',
        'жейде': 'shirts',
        'shirts': 'shirts',
        'рубашка': 'shirts',
        'рубашки': 'shirts',
        'шалбар': 'pants',
        'pants': 'pants',
        'брюки': 'pants',
        'штаны': 'pants',
        'жакет': 'jackets',
        'jackets': 'jackets',
        'куртка': 'jackets',
        'куртки': 'jackets'
    };
    
    const lowerCategory = (category || '').toLowerCase();
    return categoryMap[lowerCategory] || (['sneakers', 'shirts', 'pants', 'jackets'].includes(lowerCategory) ? lowerCategory : null);
}

function mapGender(gender) {
    const genderMap = {
        'женщины': 'women',
        'женский': 'women',
        'women': 'women',
        'әйелдер': 'women',
        'әйел': 'women',
        'жен': 'women',
        'мужчины': 'men',
        'мужской': 'men',
        'men': 'men',
        'ерлер': 'men',
        'ер': 'men',
        'муж': 'men'
    };
    
    const lowerGender = (gender || '').toLowerCase();
    return genderMap[lowerGender] || (['women', 'men'].includes(lowerGender) ? lowerGender : null);
}

function exportProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        alert(currentLang === 'kk' ? 'Экспорттауға товарлар жоқ' : 'Нет товаров для экспорта');
        return;
    }
    
    // Export as JSON
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products_' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification(currentLang === 'kk' ? 'Товарлар экспортталды' : 'Товары экспортированы');
}

// Автоматический помощник для скрапинга
function openScrapingHelper() {
    if (!checkAuth()) return;
    
    // Упрощенный скрипт для скрапинга
    const scriptContent = `(function() {
    console.log('🚀 Скрапинг запущен...');
    const products = [];
    const seen = new Set();
    const brand = window.location.hostname.includes('nike') ? 'nike' : 'adidas';
    const gender = window.location.href.includes('women') || window.location.href.includes('womens') ? 'women' : 'men';
    
    function extractSimple(el) {
        try {
            const text = el.textContent || '';
            const img = el.querySelector('img');
            let image = '';
            if (img) {
                image = img.src || img.dataset.src || img.getAttribute('data-lazy-src') || '';
                if (image && image.startsWith('//')) image = 'https:' + image;
                if (image && image.startsWith('/')) image = window.location.origin + image;
            }
            
            let price = 0;
            const priceMatch = text.match(/(\\$|€|₸)?[\\s]*([\\d,\\.]+)/);
            if (priceMatch) {
                price = parseFloat(priceMatch[2].replace(/,/g, ''));
                if (text.includes('$')) {
                    price = Math.round(price * 450 * 1.1);
                } else if (text.includes('€')) {
                    price = Math.round(price * 490 * 1.1);
                } else if (price < 1000) {
                    price = Math.round(price * 450 * 1.1);
                } else {
                    price = Math.round(price * 1.1);
                }
            }
            
            let name = '';
            const h = el.querySelector('h1, h2, h3, h4, h5, h6, a[href*="/product/"], a[href*="/t/"]');
            if (h) {
                name = h.textContent?.trim() || h.getAttribute('aria-label') || '';
            }
            if (!name || name.length < 3) {
                const words = text.trim().split(/\\s+/).filter(w => w.length > 2);
                if (words.length > 0) {
                    name = words.slice(0, 5).join(' ');
                }
            }
            
            if (name && name.length > 3 && price >= 1000 && image) {
                const key = name.toLowerCase().trim() + '_' + price;
                if (!seen.has(key)) {
                    seen.add(key);
                    let category = 'sneakers';
                    const urlLower = window.location.href.toLowerCase();
                    const nameLower = name.toLowerCase();
                    if (urlLower.includes('shoe') || nameLower.includes('shoe') || nameLower.includes('sneaker')) {
                        category = 'sneakers';
                    } else if (urlLower.includes('shirt') || urlLower.includes('top') || urlLower.includes('hoodie')) {
                        category = 'shirts';
                    } else if (urlLower.includes('pant') || urlLower.includes('trouser')) {
                        category = 'pants';
                    } else if (urlLower.includes('jacket') || urlLower.includes('outerwear')) {
                        category = 'jackets';
                    }
                    return { name, price, image, category, gender, brand };
                }
            }
        } catch (e) {}
        return null;
    }
    
    const allWithImages = Array.from(document.querySelectorAll('*')).filter(el => {
        const img = el.querySelector('img');
        return img && img.src && !img.src.includes('data:') && !img.src.includes('logo');
    });
    
    const allWithPrices = Array.from(document.querySelectorAll('*')).filter(el => {
        const text = el.textContent || '';
        return /[\\$€₸]\\s*[\\d,\\.]+/.test(text) || (/\\d+/.test(text) && text.length < 200);
    });
    
    const allElements = new Set([...allWithImages, ...allWithPrices]);
    const filtered = Array.from(allElements).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 100 && rect.height > 100;
    });
    
    filtered.forEach((el) => {
        const product = extractSimple(el);
        if (product) products.push(product);
    });
    
    console.log(\`✅ Найдено товаров: \${products.length}\`);
    
    if (products.length === 0) {
        console.log('⚠️ Товары не найдены! Прокрутите страницу вниз и запустите скрипт снова.');
        return;
    }
    
    localStorage.setItem('last_scraped_products', JSON.stringify(products));
    console.log('💾 Данные сохранены в localStorage!');
    
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${brand}_products_\${Date.now()}.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('📥 JSON файл скачан!');
})();`;

    // Копируем скрипт в буфер обмена
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(scriptContent).then(() => {
            showScrapingModal();
            showNotification(currentLang === 'kk' 
                ? '✅ Скрипт буферге көшірілді! Nike/Adidas сайтын ашып, консольге қойыңыз (Ctrl+V)' 
                : '✅ Скрипт скопирован! Откройте сайт Nike/Adidas и вставьте в консоль (Ctrl+V)', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showScrapingModalWithText(scriptContent);
        });
    } else {
        // Альтернативный метод
        showScrapingModalWithText(scriptContent);
    }
}

// Модальное окно с инструкцией
function showScrapingModal() {
    // Удаляем старое модальное окно если есть
    const oldModal = document.getElementById('scrapingHelperModal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'scrapingHelperModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative;">
            <button onclick="closeScrapingModal()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; color: #999;">&times;</button>
            <h2 style="margin-top: 0; color: var(--primary-color);">🚀 Автоматический скрапинг</h2>
            <p style="background: #d4edda; padding: 1rem; border-radius: 8px; border-left: 4px solid #28a745;"><strong>✅ Скрипт скопирован в буфер обмена!</strong></p>
            <ol style="line-height: 2; margin-top: 1.5rem;">
                <li>Откройте вкладку с сайтом <strong>Nike.com</strong> или <strong>Adidas.com</strong></li>
                <li>Откройте страницу с товарами (например, категорию обуви)</li>
                <li>Прокрутите страницу вниз, чтобы загрузились все товары</li>
                <li>Нажмите <strong>F12</strong> для открытия консоли</li>
                <li>Перейдите на вкладку <strong>"Console"</strong></li>
                <li>Нажмите <strong>Ctrl+V</strong> (или Cmd+V на Mac) чтобы вставить скрипт</li>
                <li>Нажмите <strong>Enter</strong></li>
                <li>Дождитесь сообщения "✅ Найдено товаров: X"</li>
                <li>Вернитесь в админ панель и нажмите "Импорттау" → "localStorage"</li>
            </ol>
            <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <strong>💡 Совет:</strong> Если товары не найдены, прокрутите страницу вниз еще раз и запустите скрипт повторно.
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button onclick="window.open('https://www.nike.com', '_blank')" class="btn-primary" style="flex: 1;">
                    🌐 Открыть Nike.com
                </button>
                <button onclick="window.open('https://www.adidas.com/kz/', '_blank')" class="btn-primary" style="flex: 1;">
                    🌐 Открыть Adidas.com
                </button>
            </div>
            <button onclick="closeScrapingModal()" class="btn-secondary" style="width: 100%; margin-top: 1rem;">
                Понятно, закрыть
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeScrapingModal();
        }
    });
}

function closeScrapingModal() {
    const modal = document.getElementById('scrapingHelperModal');
    if (modal) {
        modal.remove();
    }
}

// Альтернативный метод если clipboard не работает
function showScrapingModalWithText(scriptContent) {
    // Удаляем старое модальное окно если есть
    const oldModal = document.getElementById('scrapingHelperModal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'scrapingHelperModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative;">
            <button onclick="closeScrapingModal()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 2rem; cursor: pointer; color: #999;">&times;</button>
            <h2 style="margin-top: 0; color: var(--primary-color);">🚀 Автоматический скрапинг</h2>
            <p><strong>Скопируйте скрипт ниже:</strong></p>
            <textarea id="scriptTextArea" readonly style="width: 100%; height: 300px; font-family: monospace; font-size: 12px; padding: 1rem; border: 2px solid #ddd; border-radius: 8px; resize: vertical;">${scriptContent}</textarea>
            <button onclick="copyScriptText()" class="btn-primary" style="width: 100%; margin-top: 1rem;">
                📋 Копировать скрипт
            </button>
            <ol style="line-height: 2; margin-top: 1rem;">
                <li>Откройте сайт Nike.com или Adidas.com</li>
                <li>Откройте страницу с товарами</li>
                <li>Нажмите F12 → Console</li>
                <li>Вставьте скрипт (Ctrl+V) и нажмите Enter</li>
            </ol>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button onclick="window.open('https://www.nike.com', '_blank')" class="btn-primary" style="flex: 1;">
                    🌐 Открыть Nike.com
                </button>
                <button onclick="window.open('https://www.adidas.com/kz/', '_blank')" class="btn-primary" style="flex: 1;">
                    🌐 Открыть Adidas.com
                </button>
            </div>
            <button onclick="closeScrapingModal()" class="btn-secondary" style="width: 100%; margin-top: 1rem;">
                Закрыть
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyScriptText() {
    const textarea = document.getElementById('scriptTextArea');
    if (textarea) {
        textarea.select();
        document.execCommand('copy');
        showNotification(currentLang === 'kk' ? '✅ Скрипт көшірілді!' : '✅ Скрипт скопирован!', 'success');
    }
}

