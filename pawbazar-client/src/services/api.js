import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Listings API
export const listingsAPI = {
  // Get all listings with filters
  getListings: async (params = {}) => {
    const response = await api.get("/listings", { params });
    return response.data;
  },

  // Get recent listings for home page
  getRecentListings: async (limit = 6) => {
    const response = await api.get("/listings/recent", { params: { limit } });
    return response.data;
  },

  // Get single listing by ID
  getListing: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  // Create new listing
  createListing: async (listingData) => {
    const response = await api.post("/listings", listingData);
    return response.data;
  },

  // Get user's listings
  getMyListings: async (params = {}) => {
    const response = await api.get("/listings/user/my-listings", { params });
    return response.data;
  },

  // Update listing
  updateListing: async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  // Delete listing
  deleteListing: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async (params = {}) => {
    const response = await api.get("/orders/my-orders", { params });
    return response.data;
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await api.get("/orders/stats/summary");
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories with counts
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await api.get("/categories/stats");
    return response.data;
  },
};

// Favorites API
export const favoritesAPI = {
  // Get user's favorites
  getFavorites: async () => {
    const response = await api.get("/favorites");
    return response.data;
  },

  // Add to favorites
  addToFavorites: async (listingId) => {
    const response = await api.post(`/favorites/${listingId}`);
    return response.data;
  },

  // Remove from favorites
  removeFromFavorites: async (listingId) => {
    const response = await api.delete(`/favorites/${listingId}`);
    return response.data;
  },

  // Check if listing is favorited
  checkFavorite: async (listingId) => {
    const response = await api.get(`/favorites/check/${listingId}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_API_URL?.replace("/api", "/health") ||
        "http://localhost:5000/health"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
