// Performance optimization utilities

// Lazy loading utility for images
export const lazyLoadImage = (src, placeholder = "/placeholder.jpg") => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(placeholder);
    img.src = src;
  });
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce function for search inputs
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Memoization utility
export const memoize = (fn) => {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Virtual scrolling helper
export const calculateVisibleItems = (
  containerHeight,
  itemHeight,
  scrollTop,
  totalItems,
  buffer = 5
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    totalItems - 1,
    startIndex + visibleCount + buffer * 2
  );

  return { startIndex, endIndex, visibleCount };
};

// Preload critical resources
export const preloadResource = (url, type = "image") => {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    link.as = type;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
};

// Bundle size optimization - dynamic imports
export const loadComponent = (componentPath) => {
  return import(componentPath).catch((error) => {
    console.error(`Failed to load component: ${componentPath}`, error);
    throw error;
  });
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576),
      total: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
    };
  }
  return null;
};

// Performance timing
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

export default {
  lazyLoadImage,
  throttle,
  debounce,
  memoize,
  createIntersectionObserver,
  calculateVisibleItems,
  preloadResource,
  loadComponent,
  getMemoryUsage,
  measurePerformance,
};
