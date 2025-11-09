// Парсинг скрипт для intertop.kz
// Запуск: node parse-intertop.js
// Или используйте браузерную версию: parse-intertop-browser.js

const https = require('https');
const http = require('http');
const fs = require('fs');

// Конфигурация
const CONFIG = {
    baseUrl: 'https://intertop.kz',
    outputFile: 'intertop-products.json',
    maxPages: 20,
    delay: 2000
};

// Функция для получения HTML страницы
function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };
        
        protocol.get(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Функция для парсинга товаров
function parseProducts(html, gender) {
    const products = [];
    
    // Ищем товары в HTML
    // Адаптируйте селекторы под реальную структуру intertop.kz
    
    // Попытка найти товары через различные паттерны
    const patterns = [
        /<div[^>]*class="[^"]*product[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
        /<div[^>]*data-product[^>]*>[\s\S]*?<\/div>/gi,
        /<article[^>]*>[\s\S]*?<\/article>/gi
    ];
    
    let productMatches = [];
    patterns.forEach(pattern => {
        const matches = html.match(pattern);
        if (matches) {
            productMatches = productMatches.concat(matches);
        }
    });
    
    // Удаляем дубликаты
    productMatches = [...new Set(productMatches)];
    
    productMatches.forEach((productHtml, index) => {
        try {
            // Название
            let name = '';
            const namePatterns = [
                /<h[23][^>]*>([^<]+)<\/h[23]>/i,
                /<a[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/a>/i,
                /data-name="([^"]+)"/i,
                /title="([^"]+)"/i,
                /<span[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/span>/i
            ];
            
            for (const pattern of namePatterns) {
                const match = productHtml.match(pattern);
                if (match && match[1]) {
                    name = match[1].trim().replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                    break;
                }
            }
            
            if (!name) name = `Товар ${index + 1}`;
            
            // Цена
            let price = 0;
            const pricePatterns = [
                /<span[^>]*class="[^"]*price[^"]*"[^>]*>([^<]+)<\/span>/i,
                /data-price="([^"]+)"/i,
                /(\d+)\s*₸/i,
                /(\d+)\s*тенге/i,
                /price[^>]*>([^<]+)</i
            ];
            
            for (const pattern of pricePatterns) {
                const match = productHtml.match(pattern);
                if (match) {
                    const priceText = (match[1] || match[0]).replace(/[^\d]/g, '');
                    price = parseInt(priceText);
                    if (price > 0) break;
                }
            }
            
            // Изображение
            let image = '';
            const imagePatterns = [
                /<img[^>]*src="([^"]+)"[^>]*>/i,
                /<img[^>]*data-src="([^"]+)"[^>]*>/i,
                /data-src="([^"]+)"/i,
                /background-image:\s*url\(['"]?([^'"]+)['"]?\)/i
            ];
            
            for (const pattern of imagePatterns) {
                const match = productHtml.match(pattern);
                if (match && match[1]) {
                    image = match[1];
                    if (image.startsWith('//')) {
                        image = 'https:' + image;
                    } else if (image.startsWith('/')) {
                        image = CONFIG.baseUrl + image;
                    }
                    break;
                }
            }
            
            // Категория
            let category = 'sneakers';
            const categoryText = (productHtml + html).toLowerCase();
            if (categoryText.includes('кроссовки') || categoryText.includes('обувь') || categoryText.includes('sneakers') || categoryText.includes('обув')) {
                category = 'sneakers';
            } else if (categoryText.includes('рубашка') || categoryText.includes('жейде') || categoryText.includes('shirt')) {
                category = 'shirts';
            } else if (categoryText.includes('брюки') || categoryText.includes('шалбар') || categoryText.includes('pants')) {
                category = 'pants';
            } else if (categoryText.includes('куртка') || categoryText.includes('жакет') || categoryText.includes('jacket')) {
                category = 'jackets';
            }
            
            if (name && price > 0) {
                products.push({
                    name: name,
                    description: `${name}. 100% оригинал. ${gender === 'women' ? 'Әйелдерге арналған.' : 'Ерлерге арналған.'}`,
                    price: price,
                    image: image,
                    category: category,
                    gender: gender
                });
            }
        } catch (error) {
            console.error(`Ошибка при парсинге товара ${index + 1}:`, error.message);
        }
    });
    
    return products;
}

// Функция для задержки
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Основная функция парсинга
async function parseIntertop() {
    console.log('Начинаем парсинг intertop.kz...\n');
    
    const allProducts = [];
    
    try {
        // Категории для парсинга
        const categories = {
            women: [
                'zhenskaya-obuv',
                'zhenskaya-odezhda',
                'women',
                'zhenskoe'
            ],
            men: [
                'muzhskaya-obuv',
                'muzhskaya-odezhda',
                'men',
                'muzhskoe'
            ]
        };
        
        // Парсим товары для женщин
        console.log('Парсинг товаров для женщин...');
        for (const category of categories.women) {
            for (let page = 1; page <= CONFIG.maxPages; page++) {
                const urls = [
                    `${CONFIG.baseUrl}/catalog/${category}?page=${page}`,
                    `${CONFIG.baseUrl}/${category}?page=${page}`,
                    `${CONFIG.baseUrl}/category/${category}?page=${page}`
                ];
                
                let found = false;
                for (const url of urls) {
                    try {
                        console.log(`Загрузка: ${url}`);
                        const html = await fetchPage(url);
                        
                        if (html.length < 1000) {
                            continue; // Страница слишком короткая, вероятно ошибка
                        }
                        
                        const products = parseProducts(html, 'women');
                        
                        if (products.length === 0) {
                            continue;
                        }
                        
                        allProducts.push(...products);
                        console.log(`Найдено товаров: ${products.length}`);
                        found = true;
                        
                        await delay(CONFIG.delay);
                        break; // Успешно загрузили с этого URL
                    } catch (error) {
                        console.error(`Ошибка при загрузке ${url}:`, error.message);
                        continue;
                    }
                }
                
                if (!found) {
                    console.log(`Товары не найдены на странице ${page}, переходим к следующей категории`);
                    break;
                }
            }
        }
        
        // Парсим товары для мужчин
        console.log('\nПарсинг товаров для мужчин...');
        for (const category of categories.men) {
            for (let page = 1; page <= CONFIG.maxPages; page++) {
                const urls = [
                    `${CONFIG.baseUrl}/catalog/${category}?page=${page}`,
                    `${CONFIG.baseUrl}/${category}?page=${page}`,
                    `${CONFIG.baseUrl}/category/${category}?page=${page}`
                ];
                
                let found = false;
                for (const url of urls) {
                    try {
                        console.log(`Загрузка: ${url}`);
                        const html = await fetchPage(url);
                        
                        if (html.length < 1000) {
                            continue;
                        }
                        
                        const products = parseProducts(html, 'men');
                        
                        if (products.length === 0) {
                            continue;
                        }
                        
                        allProducts.push(...products);
                        console.log(`Найдено товаров: ${products.length}`);
                        found = true;
                        
                        await delay(CONFIG.delay);
                        break;
                    } catch (error) {
                        console.error(`Ошибка при загрузке ${url}:`, error.message);
                        continue;
                    }
                }
                
                if (!found) {
                    console.log(`Товары не найдены на странице ${page}, переходим к следующей категории`);
                    break;
                }
            }
        }
        
        // Удаляем дубликаты
        const uniqueProducts = [];
        const seenNames = new Set();
        
        allProducts.forEach(product => {
            const key = product.name.toLowerCase().trim();
            if (!seenNames.has(key) && product.price > 0) {
                seenNames.add(key);
                uniqueProducts.push(product);
            }
        });
        
        // Сохраняем результаты
        fs.writeFileSync(
            CONFIG.outputFile,
            JSON.stringify(uniqueProducts, null, 2),
            'utf8'
        );
        
        console.log(`\n✅ Парсинг завершен!`);
        console.log(`Всего найдено товаров: ${allProducts.length}`);
        console.log(`Уникальных товаров: ${uniqueProducts.length}`);
        console.log(`Результаты сохранены в: ${CONFIG.outputFile}`);
        console.log(`\nТеперь вы можете импортировать товары через админ панель!`);
        
    } catch (error) {
        console.error('Критическая ошибка:', error);
    }
}

// Запускаем парсинг
if (require.main === module) {
    parseIntertop();
}

module.exports = { parseIntertop, parseProducts };
