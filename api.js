// API Client for ShopKZ Backend
const API_BASE_URL = window.location.origin + '/api';

class API {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Products
    async getProducts(filters = {}) {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.brand) params.append('brand', filters.brand);
        
        const query = params.toString();
        return this.request(`/products${query ? '?' + query : ''}`);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async createProduct(product) {
        return this.request('/products', {
            method: 'POST',
            body: product,
        });
    }

    async updateProduct(id, product) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            body: product,
        });
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    async deleteProducts(ids) {
        return this.request('/products/bulk-delete', {
            method: 'POST',
            body: { ids },
        });
    }

    // Orders
    async getOrders() {
        return this.request('/orders');
    }

    async createOrder(order) {
        return this.request('/orders', {
            method: 'POST',
            body: order,
        });
    }

    async updateOrderStatus(id, status) {
        return this.request(`/orders/${id}/status`, {
            method: 'PUT',
            body: { status },
        });
    }

    // Reviews
    async getReviews() {
        return this.request('/reviews');
    }

    async createReview(review) {
        return this.request('/reviews', {
            method: 'POST',
            body: review,
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create singleton instance
const api = new API();

