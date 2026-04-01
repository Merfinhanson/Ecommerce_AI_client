// Use environment variable or default to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    (process.env.NODE_ENV === 'production' ? 'YOUR_BACKEND_URL' : 'http://localhost:5000/api');

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Product API
export const productAPI = {
  // Get all products with optional filters
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/products?${queryString}`);
  },

  // Get single product
  getProduct: (id) => fetchAPI(`/products/${id}`),

  // Get categories
  getCategories: () => fetchAPI('/products/categories'),

  // Create product (admin only)
  createProduct: (productData) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  // Update product (admin only)
  updateProduct: (id, productData) => fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),

  // Delete product (admin only)
  deleteProduct: (id) => fetchAPI(`/products/${id}`, {
    method: 'DELETE',
  }),
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: () => fetchAPI('/cart'),

  // Add item to cart
  addToCart: (productId, quantity = 1) => fetchAPI('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }),

  // Update cart item quantity
  updateCartItem: (productId, quantity) => fetchAPI(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  // Remove item from cart
  removeFromCart: (productId) => fetchAPI(`/cart/${productId}`, {
    method: 'DELETE',
  }),

  // Clear cart
  clearCart: () => fetchAPI('/cart', {
    method: 'DELETE',
  }),
};

// Auth API
export const authAPI = {
  // Register
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Login
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Get current user
  getMe: () => fetchAPI('/auth/me'),

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  googleLogin: (userData) => fetchAPI('/auth/google', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  appleLogin: (userData) => fetchAPI('/auth/apple', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

const api = { productAPI, cartAPI, authAPI };
export default api;
