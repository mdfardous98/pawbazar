// App Constants
export const APP_NAME = "PawBazar";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "Pet Adoption & Supply Portal";

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_TIMEOUT = 10000;

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Categories
export const CATEGORIES = [
  { value: "all", label: "All Categories", icon: "🐾" },
  { value: "dogs", label: "Dogs", icon: "🐕" },
  { value: "cats", label: "Cats", icon: "🐱" },
  { value: "birds", label: "Birds", icon: "🐦" },
  { value: "fish", label: "Fish", icon: "🐠" },
  { value: "food", label: "Pet Food", icon: "🥘" },
  { value: "accessories", label: "Accessories", icon: "🎾" },
  { value: "toys", label: "Toys", icon: "🧸" },
  { value: "healthcare", label: "Healthcare", icon: "💊" },
];

// Sort Options
export const SORT_OPTIONS = [
  { value: "date", label: "Latest First" },
  { value: "price", label: "Price" },
  { value: "name", label: "Name" },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

// Price Ranges
export const PRICE_RANGES = [
  { label: "Free Adoption", min: 0, max: 0 },
  { label: "Under ৳1,000", min: 1, max: 1000 },
  { label: "৳1,000 - ৳5,000", min: 1000, max: 5000 },
  { label: "Above ৳5,000", min: 5000, max: null },
];

// Locations (Bangladesh)
export const POPULAR_LOCATIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Barisal",
  "Khulna",
  "Rangpur",
  "Mymensingh",
];

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.CONFIRMED]: "Confirmed",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.SHIPPED]: "Shipped",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
  [ORDER_STATUS.COMPLETED]: "Completed",
};

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  PHONE_REGEX: /^[\+]?[0-9\s\-\(\)]{10,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_PREFERENCES: "userPreferences",
  SEARCH_HISTORY: "searchHistory",
  FAVORITES: "favorites",
};

// Toast Configuration
export const TOAST_CONFIG = {
  duration: 4000,
  position: "top-right",
  style: {
    background: "#363636",
    color: "#fff",
  },
};

// Image Placeholders
export const IMAGE_PLACEHOLDERS = {
  PET: "https://via.placeholder.com/400x300/10b981/ffffff?text=🐾+Pet",
  PRODUCT: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=📦+Product",
  USER: "https://via.placeholder.com/100x100/3b82f6/ffffff?text=👤",
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://www.facebook.com/tajwar.fardous",
  LINKEDIN: "https://www.linkedin.com/in/mdfardous",
  GITHUB: "https://github.com/mdfardous98",
  EMAIL: "mailto:mdjfardous@gmail.com",
};

// Contact Information
export const CONTACT_INFO = {
  EMAIL: "mdjfardous@gmail.com",
  PHONE: "+8801688645882",
  ADDRESS: "Dhaka, Bangladesh",
  DEVELOPER: "MD Fardous",
};
