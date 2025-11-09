// Global products array (will be loaded from API)
let products = [];

// Default products for fallback
const defaultProducts = [
    // Аяқ киім - Ерлер
    {
        id: 1,
        name: 'Nike Air Max 270 кроссовки',
        description: '100% оригинал Nike Air Max 270 кроссовки. Ерлерге арналған. Комфортты және стильді.',
        price: 55000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 2,
        name: 'Nike Air Force 1 кроссовки',
        description: '100% оригинал Nike Air Force 1 классикалық кроссовки. Ерлерге арналған.',
        price: 48000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 3,
        name: 'Nike Dunk Low кроссовки',
        description: '100% оригинал Nike Dunk Low кроссовки. Ерлерге арналған. Спорттық стиль.',
        price: 52000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 4,
        name: 'Adidas Ultraboost 22 кроссовки',
        description: '100% оригинал Adidas Ultraboost 22 кроссовки. Ерлерге арналған. Технологиялық дизайн.',
        price: 60000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 5,
        name: 'Adidas Yeezy Boost 350 кроссовки',
        description: '100% оригинал Adidas Yeezy Boost 350 кроссовки. Ерлерге арналған. Премиум сапа.',
        price: 75000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 6,
        name: 'Adidas Stan Smith кроссовки',
        description: '100% оригинал Adidas Stan Smith классикалық кроссовки. Ерлерге арналған.',
        price: 38000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 7,
        name: 'Puma Suede Classic кроссовки',
        description: '100% оригинал Puma Suede Classic кроссовки. Ерлерге арналған. Классикалық дизайн.',
        price: 35000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 8,
        name: 'Puma RS-X кроссовки',
        description: '100% оригинал Puma RS-X кроссовки. Ерлерге арналған. Ретро стиль.',
        price: 42000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 9,
        name: 'Reebok Classic Leather кроссовки',
        description: '100% оригинал Reebok Classic Leather кроссовки. Ерлерге арналған.',
        price: 32000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 10,
        name: 'New Balance 574 кроссовки',
        description: '100% оригинал New Balance 574 кроссовки. Ерлерге арналған. Комфортты және сапалы.',
        price: 45000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 11,
        name: 'Vans Old Skool кроссовки',
        description: '100% оригинал Vans Old Skool кроссовки. Ерлерге арналған. Стрит-стиль.',
        price: 40000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    {
        id: 12,
        name: 'Converse Chuck Taylor All Star кроссовки',
        description: '100% оригинал Converse Chuck Taylor All Star кроссовки. Ерлерге арналған. Вечная классика.',
        price: 28000,
        image: '',
        category: 'sneakers',
        gender: 'men'
    },
    // Аяқ киім - Әйелдер
    {
        id: 13,
        name: 'Nike Air Max 90 кроссовки',
        description: '100% оригинал Nike Air Max 90 кроссовки. Әйелдерге арналған. Стильді және комфортты.',
        price: 50000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 14,
        name: 'Nike Air Force 1 кроссовки',
        description: '100% оригинал Nike Air Force 1 кроссовки. Әйелдерге арналған. Классикалық дизайн.',
        price: 45000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 15,
        name: 'Adidas Superstar кроссовки',
        description: '100% оригинал Adidas Superstar кроссовки. Әйелдерге арналған. Иконалық модель.',
        price: 42000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 16,
        name: 'Adidas Gazelle кроссовки',
        description: '100% оригинал Adidas Gazelle кроссовки. Әйелдерге арналған. Ретро стиль.',
        price: 40000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 17,
        name: 'Adidas Samba кроссовки',
        description: '100% оригинал Adidas Samba кроссовки. Әйелдерге арналған. Классикалық футбольный стиль.',
        price: 38000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 18,
        name: 'Puma Cali кроссовки',
        description: '100% оригинал Puma Cali кроссовки. Әйелдерге арналған. Стильді және ыңғайлы.',
        price: 36000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 19,
        name: 'Puma Platform кроссовки',
        description: '100% оригинал Puma Platform кроссовки. Әйелдерге арналған. Платформалық дизайн.',
        price: 44000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 20,
        name: 'Reebok Club C 85 кроссовки',
        description: '100% оригинал Reebok Club C 85 кроссовки. Әйелдерге арналған. Классикалық модель.',
        price: 30000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 21,
        name: 'New Balance 327 кроссовки',
        description: '100% оригинал New Balance 327 кроссовки. Әйелдерге арналған. Ретро-футуристикалық дизайн.',
        price: 48000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 22,
        name: 'Vans Authentic кроссовки',
        description: '100% оригинал Vans Authentic кроссовки. Әйелдерге арналған. Классикалық скейтборд стиль.',
        price: 35000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 23,
        name: 'Converse Chuck 70 кроссовки',
        description: '100% оригинал Converse Chuck 70 кроссовки. Әйелдерге арналған. Премиум версия.',
        price: 42000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    {
        id: 24,
        name: 'Fila Disruptor II кроссовки',
        description: '100% оригинал Fila Disruptor II кроссовки. Әйелдерге арналған. Платформалық дизайн.',
        price: 38000,
        image: '',
        category: 'sneakers',
        gender: 'women'
    },
    // Жейделер - Ерлер
    {
        id: 25,
        name: 'Nike Dri-FIT футболка',
        description: '100% оригинал Nike Dri-FIT футболка. Ерлерге арналған. Спорттық технология.',
        price: 18000,
        image: '',
        category: 'shirts',
        gender: 'men'
    },
    {
        id: 26,
        name: 'Adidas Originals футболка',
        description: '100% оригинал Adidas Originals футболка. Ерлерге арналған. Классикалық дизайн.',
        price: 16000,
        image: '',
        category: 'shirts',
        gender: 'men'
    },
    {
        id: 27,
        name: 'Puma Classic футболка',
        description: '100% оригинал Puma Classic футболка. Ерлерге арналған. Комфортты материал.',
        price: 15000,
        image: '',
        category: 'shirts',
        gender: 'men'
    },
    {
        id: 28,
        name: 'Классикалық жейде',
        description: 'Ерлерге арналған классикалық жейде. 100% оригинал. Офис стиль.',
        price: 22000,
        image: '',
        category: 'shirts',
        gender: 'men'
    },
    {
        id: 29,
        name: 'Polo жейде',
        description: 'Ерлерге арналған Polo жейде. 100% оригинал. Классикалық стиль.',
        price: 25000,
        image: '',
        category: 'shirts',
        gender: 'men'
    },
    // Жейделер - Әйелдер
    {
        id: 30,
        name: 'Nike Swoosh футболка',
        description: '100% оригинал Nike Swoosh футболка. Әйелдерге арналған. Спорттық стиль.',
        price: 20000,
        image: '',
        category: 'shirts',
        gender: 'women'
    },
    {
        id: 31,
        name: 'Adidas Trefoil футболка',
        description: '100% оригинал Adidas Trefoil футболка. Әйелдерге арналған. Классикалық логотип.',
        price: 18000,
        image: '',
        category: 'shirts',
        gender: 'women'
    },
    {
        id: 32,
        name: 'Puma Logo футболка',
        description: '100% оригинал Puma Logo футболка. Әйелдерге арналған. Стильді дизайн.',
        price: 17000,
        image: '',
        category: 'shirts',
        gender: 'women'
    },
    {
        id: 33,
        name: 'Әйелдер жейдесі',
        description: 'Әйелдерге арналған стильді жейде. 100% оригинал. Кеңдегі стиль.',
        price: 24000,
        image: '',
        category: 'shirts',
        gender: 'women'
    },
    {
        id: 34,
        name: 'Блузка',
        description: 'Әйелдерге арналған элегантты блузка. 100% оригинал. Офис стиль.',
        price: 28000,
        image: '',
        category: 'shirts',
        gender: 'women'
    },
    // Шалбарлар - Ерлер
    {
        id: 35,
        name: 'Nike Sportswear шалбар',
        description: '100% оригинал Nike Sportswear шалбар. Ерлерге арналған. Спорттық стиль.',
        price: 32000,
        image: '',
        category: 'pants',
        gender: 'men'
    },
    {
        id: 36,
        name: 'Adidas Tiro шалбар',
        description: '100% оригинал Adidas Tiro шалбар. Ерлерге арналған. Футбольный стиль.',
        price: 30000,
        image: '',
        category: 'pants',
        gender: 'men'
    },
    {
        id: 37,
        name: 'Джинс шалбар',
        description: 'Ерлерге арналған джинс шалбар. 100% оригинал. Классикалық стиль.',
        price: 28000,
        image: '',
        category: 'pants',
        gender: 'men'
    },
    {
        id: 38,
        name: 'Чинос шалбар',
        description: 'Ерлерге арналған чинос шалбар. 100% оригинал. Офис стиль.',
        price: 26000,
        image: '',
        category: 'pants',
        gender: 'men'
    },
    // Шалбарлар - Әйелдер
    {
        id: 39,
        name: 'Nike Sportswear шалбар',
        description: '100% оригинал Nike Sportswear шалбар. Әйелдерге арналған. Спорттық стиль.',
        price: 30000,
        image: '',
        category: 'pants',
        gender: 'women'
    },
    {
        id: 40,
        name: 'Adidas Originals шалбар',
        description: '100% оригинал Adidas Originals шалбар. Әйелдерге арналған. Классикалық дизайн.',
        price: 28000,
        image: '',
        category: 'pants',
        gender: 'women'
    },
    {
        id: 41,
        name: 'Джинс шалбар',
        description: 'Әйелдерге арналған джинс шалбар. 100% оригинал. Классикалық стиль.',
        price: 25000,
        image: '',
        category: 'pants',
        gender: 'women'
    },
    {
        id: 42,
        name: 'Леггинсы',
        description: 'Әйелдерге арналған спорттық леггинсы. 100% оригинал. Комфортты материал.',
        price: 22000,
        image: '',
        category: 'pants',
        gender: 'women'
    },
    // Жакеттер - Ерлер
    {
        id: 43,
        name: 'Nike Windrunner жакет',
        description: '100% оригинал Nike Windrunner жакет. Ерлерге арналған. Спорттық технология.',
        price: 45000,
        image: '',
        category: 'jackets',
        gender: 'men'
    },
    {
        id: 44,
        name: 'Adidas Originals жакет',
        description: '100% оригинал Adidas Originals жакет. Ерлерге арналған. Классикалық стиль.',
        price: 42000,
        image: '',
        category: 'jackets',
        gender: 'men'
    },
    {
        id: 45,
        name: 'Puma Classic жакет',
        description: '100% оригинал Puma Classic жакет. Ерлерге арналған. Стильді дизайн.',
        price: 38000,
        image: '',
        category: 'jackets',
        gender: 'men'
    },
    {
        id: 46,
        name: 'Классикалық жакет',
        description: 'Ерлерге арналған классикалық жакет. 100% оригинал. Офис стиль.',
        price: 40000,
        image: '',
        category: 'jackets',
        gender: 'men'
    },
    // Жакеттер - Әйелдер
    {
        id: 47,
        name: 'Nike Sportswear жакет',
        description: '100% оригинал Nike Sportswear жакет. Әйелдерге арналған. Спорттық стиль.',
        price: 42000,
        image: '',
        category: 'jackets',
        gender: 'women'
    },
    {
        id: 48,
        name: 'Adidas Originals жакет',
        description: '100% оригинал Adidas Originals жакет. Әйелдерге арналған. Классикалық дизайн.',
        price: 40000,
        image: '',
        category: 'jackets',
        gender: 'women'
    },
    {
        id: 49,
        name: 'Puma Classic жакет',
        description: '100% оригинал Puma Classic жакет. Әйелдерге арналған. Стильді дизайн.',
        price: 36000,
        image: '',
        category: 'jackets',
        gender: 'women'
    },
    {
        id: 50,
        name: 'Демисезондық жакет',
        description: 'Әйелдерге арналған демисезондық жакет. 100% оригинал. Стильді және практикалық.',
        price: 38000,
        image: '',
        category: 'jackets',
        gender: 'women'
    }
];

// Reviews (will be loaded from API)
let reviews = [];

// Default reviews for fallback
const defaultReviews = [
    {
        id: 1,
        name: 'Айгүл',
        text: 'Тапсырыс бердім, керемет! Сапасы өте жақсы, 100% оригинал. Ұсынылады!',
        rating: 5,
        date: '2024-01-15'
    },
    {
        id: 2,
        name: 'Ерлан',
        text: 'Кроссовки сатып алдым, өте қанағаттанарлық. Жеткізу тез болды.',
        rating: 5,
        date: '2024-01-20'
    },
    {
        id: 3,
        name: 'Мария',
        text: 'Өте жақсы дүкен! Барлық киімдер оригинал, бағасы да тиімді.',
        rating: 5,
        date: '2024-01-25'
    },
    {
        id: 4,
        name: 'Нұрлан',
        text: 'Тапсырыс бердім, керемет! Сапасы өте жақсы, 100% оригинал. Ұсынылады!',
        rating: 5,
        date: '2024-02-01'
    }
];

// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Load products and reviews from API
    await loadProducts();
    await loadReviews();
    updateCartCount();
    setupEventListeners();
    translatePage();
    updateLangButton();
    
    // Update products count
    updateProductsCount(products.length, products.length);
    
    // Слушаем изменения в localStorage для обновления при удалении товаров в админ панели
    window.addEventListener('storage', (e) => {
        if (e.key === 'products' || e.key === null) {
            loadProducts().then(() => {
                updateProductsCount(products.length, products.length);
            });
        }
    });
    
    // Также проверяем периодически (на случай если storage event не сработал)
    setInterval(async () => {
        try {
            const apiProducts = await api.getProducts();
            const currentIds = products.map(p => p.id).sort().join(',');
            const apiIds = apiProducts.map(p => p.id).sort().join(',');
            if (currentIds !== apiIds) {
                await loadProducts();
                updateProductsCount(products.length, products.length);
            }
        } catch (e) {
            // Игнорируем ошибки при проверке
        }
    }, 3000); // Проверяем каждые 3 секунды
});

function setupEventListeners() {
    // Language switcher
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', switchLanguage);
    }

    // Cart icon
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            openCart();
        });
    }

    // Cart modal close
    const cartModal = document.getElementById('cartModal');
    const cartClose = cartModal?.querySelector('.close');
    if (cartClose) {
        cartClose.addEventListener('click', () => {
            closeCart();
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

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    // Order form
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
                closeCart();
            }
        });
    }

    // Phone input formatting
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // Gender filter buttons
    updateFilterButtons();
}

async function loadReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;

    try {
        reviews = await api.getReviews();
    } catch (error) {
        console.error('Error loading reviews from API, falling back to localStorage:', error);
        reviews = JSON.parse(localStorage.getItem('reviews')) || defaultReviews;
        if (reviews.length === 0) {
            reviews = defaultReviews;
        }
    }

    reviewsGrid.innerHTML = '';

    if (reviews.length === 0) {
        reviewsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: var(--text-light); font-weight: 600;">Пікірлер жоқ</p>';
        return;
    }

    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        const stars = '⭐'.repeat(review.rating || 5);
        reviewCard.innerHTML = `
            <p class="review-text">"${review.text}"</p>
            <div class="review-author">
                <span class="review-author-name">${review.name}</span>
                <span class="review-rating">${stars}</span>
            </div>
        `;
        reviewsGrid.appendChild(reviewCard);
    });
}

// Global products array
async function loadProducts() {
    try {
        // Try to load from API first
        const filters = {
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            gender: selectedGender !== 'all' ? selectedGender : undefined,
        };
        products = await api.getProducts(filters);
        // Очищаем localStorage если товары загружены с API
        localStorage.removeItem('products');
        filterProducts();
    } catch (error) {
        console.error('Error loading products from API, falling back to localStorage:', error);
        // Fallback to localStorage (но не defaultProducts - они только для первого запуска)
        products = JSON.parse(localStorage.getItem('products')) || [];
        // Если в localStorage тоже пусто, оставляем пустой массив
        filterProducts();
    }
}

// Current filters
let selectedGender = 'all';
let selectedCategory = 'all';

function selectGender(gender) {
    selectedGender = gender;
    selectedCategory = 'all';
    
    // Update button states
    document.querySelectorAll('.filter-btn[data-gender]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-gender') === gender) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide category section
    const categorySection = document.getElementById('categorySection');
    if (gender !== 'all') {
        categorySection.style.display = 'block';
        loadCategoryButtons(gender);
    } else {
        categorySection.style.display = 'none';
    }
    
    // Reload products from API when filters change
    loadProducts();
}

function selectCategory(category) {
    selectedCategory = category;
    
    // Update button states
    document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Reload products from API when category changes
    loadProducts();
}

function loadCategoryButtons(gender) {
    const categoryButtons = document.getElementById('categoryButtons');
    if (!categoryButtons) return;
    
    const categoryNames = {
        'all': currentLang === 'kk' ? 'Барлығы' : 'Все',
        'sneakers': currentLang === 'kk' ? 'Кроссовки' : 'Кроссовки',
        'shirts': currentLang === 'kk' ? 'Жейделер' : 'Рубашки',
        'pants': currentLang === 'kk' ? 'Шалбарлар' : 'Брюки',
        'jackets': currentLang === 'kk' ? 'Жакеттер' : 'Куртки'
    };
    
    const categories = [
        { value: 'all', name: categoryNames.all, icon: '👕' },
        { value: 'sneakers', name: categoryNames.sneakers, icon: '👟' },
        { value: 'shirts', name: categoryNames.shirts, icon: '👔' },
        { value: 'pants', name: categoryNames.pants, icon: '👖' },
        { value: 'jackets', name: categoryNames.jackets, icon: '🧥' }
    ];
    
    categoryButtons.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        if (cat.value === selectedCategory) {
            btn.classList.add('active');
        }
        btn.setAttribute('data-category', cat.value);
        btn.onclick = () => selectCategory(cat.value);
        btn.innerHTML = `<span>${cat.icon}</span> ${cat.name}`;
        categoryButtons.appendChild(btn);
    });
}

function updateFilterButtons() {
    // Set default active state
    const allBtn = document.querySelector('.filter-btn[data-gender="all"]');
    if (allBtn) {
        allBtn.classList.add('active');
    }
}

function filterProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    // Products are already loaded in loadProducts()
    let filteredProducts = [...products];
    
    // Filter by gender
    if (selectedGender !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            return product.gender === selectedGender;
        });
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            return product.category === selectedCategory;
        });
    }
    
    // Сортировка: Nike и Adidas первыми, затем Lamoda и Kaspi, затем остальные
    filteredProducts.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        const descA = (a.description || '').toLowerCase();
        const descB = (b.description || '').toLowerCase();
        const brandA = (a.brand || '').toLowerCase();
        const brandB = (b.brand || '').toLowerCase();
        
        // Функция для определения приоритета
        const getPriority = (name, desc, brand) => {
            // Проверяем поле brand сначала
            if (brand === 'nike') return 1; // Самый высокий приоритет
            if (brand === 'adidas') return 2;
            if (brand === 'lamoda') return 3;
            if (brand === 'kaspi') return 4;
            
            // Затем проверяем название и описание
            if (name.includes('nike') || desc.includes('nike')) return 1;
            if (name.includes('adidas') || desc.includes('adidas')) return 2;
            if (name.includes('lamoda') || desc.includes('lamoda')) return 3;
            if (name.includes('kaspi') || desc.includes('kaspi')) return 4;
            
            return 5; // Остальные товары
        };
        
        const priorityA = getPriority(nameA, descA, brandA);
        const priorityB = getPriority(nameB, descB, brandB);
        
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        
        // Если приоритет одинаковый, сортируем по названию
        return nameA.localeCompare(nameB);
    });
    
    // Update filter info
    updateFilterInfo();
    
    // Update products count
    updateProductsCount(filteredProducts.length, products.length);

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        const noProductsMsg = currentLang === 'kk' ? 'Өнімдер табылмады' : 'Товары не найдены';
        productsGrid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-light); font-weight: 600;">${noProductsMsg}</p>`;
        translatePage();
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" itemscope itemtype="https://schema.org/Product">
                ${product.image ? `<img src="${product.image}" alt="${product.name} - ${product.description}" style="width: 100%; height: 100%; object-fit: cover;" itemprop="image">` : '<span itemprop="image">👕</span>'}
            </div>
            <div class="product-info">
                <h3 class="product-name" itemprop="name">${product.name}</h3>
                <p class="product-description" itemprop="description">${product.description}</p>
                <div class="product-category">
                    <span class="category-badge">${getCategoryName(product.category)}</span>
                    <span class="gender-badge">${getGenderName(product.gender)}</span>
                </div>
                <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <span itemprop="price" content="${product.price}">${formatPrice(product.price)}</span>
                    <meta itemprop="priceCurrency" content="KZT">
                    <meta itemprop="availability" content="https://schema.org/InStock">
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" data-translate="products.addToCart">Себетке қосу</button>
                    <button class="btn btn-secondary" onclick="viewProduct(${product.id})" data-translate="products.viewDetails">Толығырақ</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    translatePage();
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

function clearFilters() {
    selectedGender = 'all';
    selectedCategory = 'all';
    
    // Reset button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set "all" button active
    const allBtn = document.querySelector('.filter-btn[data-gender="all"]');
    if (allBtn) {
        allBtn.classList.add('active');
    }
    
    // Hide category section
    const categorySection = document.getElementById('categorySection');
    if (categorySection) {
        categorySection.style.display = 'none';
    }
    
    filterProducts();
}

function updateProductsCount(filteredCount, totalCount) {
    const totalProductsCountEl = document.getElementById('totalProductsCount');
    if (totalProductsCountEl) {
        if (filteredCount === totalCount) {
            totalProductsCountEl.textContent = totalCount;
        } else {
            totalProductsCountEl.textContent = `${filteredCount} / ${totalCount}`;
        }
    }
}

function updateFilterInfo() {
    const filterInfo = document.getElementById('filterInfo');
    if (!filterInfo) return;
    
    let info = '';
    if (selectedGender !== 'all') {
        info += getGenderName(selectedGender);
    }
    if (selectedCategory !== 'all') {
        if (info) info += ' → ';
        info += getCategoryName(selectedCategory);
    }
    
    if (info) {
        filterInfo.textContent = currentLang === 'kk' ? `Таңдалған: ${info}` : `Выбрано: ${info}`;
    } else {
        filterInfo.textContent = '';
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(currentLang === 'kk' ? 'Өнім себетке қосылды' : 'Товар добавлен в корзину');
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    renderCart();
    cartModal.classList.add('show');
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('show');
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p style="text-align: center; color: var(--text-light);" data-translate="cart.empty">Себет бос</p>`;
        translatePage();
        cartTotal.textContent = '0 ₸';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})" data-translate="cart.remove">Жою</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = formatPrice(total);
    translatePage();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const productModal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    if (!productModal || !productDetails) return;

    productDetails.innerHTML = `
        <div style="text-align: center;" itemscope itemtype="https://schema.org/Product">
            <div class="product-image" style="margin-bottom: 1.5rem;">
                ${product.image ? `<img src="${product.image}" alt="${product.name} - ${product.description}" itemprop="image" style="width: 100%; height: 100%; object-fit: cover;">` : '<span itemprop="image">🛍️</span>'}
            </div>
            <h2 style="margin-bottom: 1rem;" itemprop="name">${product.name}</h2>
            <p style="color: var(--text-light); margin-bottom: 1.5rem;" itemprop="description">${product.description}</p>
            <div class="product-price" style="margin-bottom: 1.5rem;" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                <span itemprop="price" content="${product.price}">${formatPrice(product.price)}</span>
                <meta itemprop="priceCurrency" content="KZT">
                <meta itemprop="availability" content="https://schema.org/InStock">
            </div>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeProductModal();" data-translate="products.addToCart">Себетке қосу</button>
        </div>
    `;

    productModal.classList.add('show');
    translatePage();
}

function closeProductModal() {
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.classList.remove('show');
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const comment = document.getElementById('orderComment').value;

    if (!name || !phone) {
        alert(currentLang === 'kk' ? 'Аты-жөні мен телефон нөмірін толтырыңыз' : 'Заполните имя и номер телефона');
        return;
    }

    const order = {
        name,
        phone,
        address: address || comment || 'Не указан',
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    try {
        // Save order to API
        await api.createOrder(order);
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Reset form
        e.target.reset();

        // Show success message
        showNotification(currentLang === 'kk' ? 'Тапсырыс сәтті жіберілді!' : 'Заказ успешно отправлен!');
    } catch (error) {
        console.error('Error submitting order:', error);
        // Fallback to localStorage
        const orderWithId = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            customer: { name, phone, address, comment },
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderWithId);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        e.target.reset();
        showNotification(currentLang === 'kk' ? 'Тапсырыс сәтті жіберілді!' : 'Заказ успешно отправлен!');
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('7')) {
        value = '+' + value;
    } else if (value.startsWith('8')) {
        value = '+7' + value.substring(1);
    } else if (value && !value.startsWith('+')) {
        value = '+7' + value;
    }
    
    if (value.length > 1) {
        let formatted = value.substring(0, 2);
        if (value.length > 2) {
            formatted += ' (' + value.substring(2, 5);
        }
        if (value.length > 5) {
            formatted += ') ' + value.substring(5, 8);
        }
        if (value.length > 8) {
            formatted += '-' + value.substring(8, 10);
        }
        if (value.length > 10) {
            formatted += '-' + value.substring(10, 12);
        }
        e.target.value = formatted;
    } else {
        e.target.value = value;
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('kk-KZ', {
        style: 'currency',
        currency: 'KZT',
        minimumFractionDigits: 0
    }).format(price).replace('KZT', '₸');
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

