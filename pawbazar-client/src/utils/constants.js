// Application constants

export const APP_CONFIG = {
  name: "PawBazar",
  version: "1.0.0",
  description: "Pet Adoption & Supply Portal",
  author: "MD Fardous",
  email: "mdjfardous@gmail.com",
  website: "https://pawbazar.com",
  github: "https://github.com/mdfardous98/pawbazar",
};

export const API_ENDPOINTS = {
  base: import.meta.env.VITE_API_URL || "http://localhost:5000",
  listings: "/api/listings",
  orders: "/api/orders",
  search: "/api/search",
  stats: "/api/stats",
  analytics: "/api/analytics",
  health: "/health",
};

export const ROUTES = {
  home: "/",
  petsSupplies: "/pets-supplies",
  listingDetails: "/listing/:id",
  addListing: "/add-listing",
  myListings: "/my-listings",
  myOrders: "/my-orders",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  help: "/help",
  about: "/about",
  login: "/login",
  register: "/register",
};

export const PET_CATEGORIES = [
  { value: "all", label: "All Categories", icon: "🐾" },
  { value: "dogs", label: "Dogs", icon: "🐕" },
  { value: "cats", label: "Cats", icon: "🐱" },
  { value: "birds", label: "Birds", icon: "🐦" },
  { value: "fish", label: "Fish", icon: "🐠" },
  { value: "rabbits", label: "Rabbits", icon: "🐰" },
  { value: "hamsters", label: "Hamsters", icon: "🐹" },
  { value: "reptiles", label: "Reptiles", icon: "🦎" },
  { value: "food", label: "Pet Food", icon: "🥘" },
  { value: "accessories", label: "Accessories", icon: "🎾" },
  { value: "toys", label: "Toys", icon: "🧸" },
  { value: "healthcare", label: "Healthcare", icon: "💊" },
  { value: "grooming", label: "Grooming", icon: "✂️" },
  { value: "training", label: "Training", icon: "🎓" },
];

export const SORT_OPTIONS = [
  { value: "date", label: "Date Added" },
  { value: "price", label: "Price" },
  { value: "name", label: "Name" },
  { value: "location", label: "Location" },
  { value: "relevance", label: "Relevance" },
];

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.CONFIRMED]: "Confirmed",
  [ORDER_STATUS.SHIPPED]: "Shipped",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "badge-warning",
  [ORDER_STATUS.CONFIRMED]: "badge-info",
  [ORDER_STATUS.SHIPPED]: "badge-primary",
  [ORDER_STATUS.DELIVERED]: "badge-success",
  [ORDER_STATUS.CANCELLED]: "badge-error",
};

export const LOCATIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Tangail",
  "Jessore",
  "Bogra",
  "Dinajpur",
  "Pabna",
  "Kushtia",
  "Faridpur",
  "Brahmanbaria",
  "Chandpur",
  "Lakshmipur",
  "Narsingdi",
];

export const PRICE_RANGES = [
  { label: "Free Adoption", min: 0, max: 0 },
  { label: "Under ৳1,000", min: 1, max: 1000 },
  { label: "৳1,000 - ৳5,000", min: 1000, max: 5000 },
  { label: "৳5,000 - ৳10,000", min: 5000, max: 10000 },
  { label: "৳10,000 - ৳25,000", min: 10000, max: 25000 },
  { label: "Above ৳25,000", min: 25000, max: Infinity },
];

export const CONTACT_CATEGORIES = [
  { value: "general", label: "General Question" },
  { value: "technical", label: "Technical Issue" },
  { value: "account", label: "Account Problem" },
  { value: "payment", label: "Payment Issue" },
  { value: "report", label: "Report Content" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership" },
  { value: "media", label: "Media Inquiry" },
];

export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "text-success" },
  { value: "medium", label: "Medium", color: "text-warning" },
  { value: "high", label: "High", color: "text-error" },
  { value: "urgent", label: "Urgent", color: "text-error font-bold" },
];

export const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "Auto (System)" },
];

export const LANGUAGES = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "bn", label: "বাংলা", flag: "🇧🇩" },
];

export const CURRENCIES = [
  { value: "BDT", label: "BDT (৳)", symbol: "৳" },
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
];

export const PAGINATION = {
  defaultLimit: 12,
  maxLimit: 100,
  defaultPage: 1,
};

export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
};

export const VALIDATION_RULES = {
  name: { min: 2, max: 100 },
  description: { min: 10, max: 1000 },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/ },
  password: {
    min: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  },
  price: { min: 0, max: 1000000 },
  quantity: { min: 1, max: 100 },
};

export const LOCAL_STORAGE_KEYS = {
  authToken: "authToken",
  theme: "theme",
  language: "language",
  userSettings: "userSettings",
  searchHistory: "searchHistory",
  favorites: "favorites",
  recentlyViewed: "recentlyViewed",
};

export const SESSION_STORAGE_KEYS = {
  searchFilters: "searchFilters",
  formData: "formData",
  scrollPosition: "scrollPosition",
};

export const ERROR_MESSAGES = {
  network: "Network error. Please check your connection.",
  unauthorized: "You need to be logged in to perform this action.",
  forbidden: "You don't have permission to perform this action.",
  notFound: "The requested resource was not found.",
  validation: "Please check your input and try again.",
  server: "Something went wrong on our end. Please try again later.",
  timeout: "Request timed out. Please try again.",
  unknown: "An unexpected error occurred. Please try again.",
};

export const SUCCESS_MESSAGES = {
  login: "Logged in successfully!",
  logout: "Logged out successfully!",
  register: "Account created successfully!",
  listingCreated: "Listing created successfully!",
  listingUpdated: "Listing updated successfully!",
  listingDeleted: "Listing deleted successfully!",
  orderPlaced: "Order placed successfully!",
  orderCancelled: "Order cancelled successfully!",
  profileUpdated: "Profile updated successfully!",
  settingsSaved: "Settings saved successfully!",
  messageSent: "Message sent successfully!",
};

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/pawbazar",
  twitter: "https://twitter.com/pawbazar",
  instagram: "https://instagram.com/pawbazar",
  youtube: "https://youtube.com/pawbazar",
  linkedin: "https://linkedin.com/company/pawbazar",
  github: "https://github.com/mdfardous98/pawbazar",
};

export const EXTERNAL_LINKS = {
  firebase: "https://firebase.google.com/",
  mongodb: "https://mongodb.com/",
  react: "https://reactjs.org/",
  tailwind: "https://tailwindcss.com/",
  daisyui: "https://daisyui.com/",
  vite: "https://vitejs.dev/",
};

export const FEATURE_FLAGS = {
  enableNotifications: true,
  enableAdvancedSearch: true,
  enableAnalytics: true,
  enableChat: false,
  enablePayments: false,
  enableReviews: false,
  enableWishlist: true,
  enableSocialLogin: true,
};

export default {
  APP_CONFIG,
  API_ENDPOINTS,
  ROUTES,
  PET_CATEGORIES,
  SORT_OPTIONS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  LOCATIONS,
  PRICE_RANGES,
  CONTACT_CATEGORIES,
  PRIORITY_LEVELS,
  THEMES,
  LANGUAGES,
  CURRENCIES,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION_RULES,
  LOCAL_STORAGE_KEYS,
  SESSION_STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SOCIAL_LINKS,
  EXTERNAL_LINKS,
  FEATURE_FLAGS,
};
