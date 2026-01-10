// Error monitoring and reporting utility
import toast from "react-hot-toast";

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.setupGlobalErrorHandlers();
  }

  setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      this.logError("Unhandled Promise Rejection", event.reason);

      // Prevent the default browser behavior
      event.preventDefault();
    });

    // Handle JavaScript errors
    window.addEventListener("error", (event) => {
      console.error("JavaScript error:", event.error);
      this.logError("JavaScript Error", event.error);
    });

    // Handle React errors (this will be caught by ErrorBoundary)
    window.addEventListener("react-error", (event) => {
      console.error("React error:", event.detail);
      this.logError("React Error", event.detail);
    });
  }

  logError(type, error) {
    const errorInfo = {
      type,
      message: error?.message || error?.toString() || "Unknown error",
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorInfo);

    // Keep only last 50 errors to prevent memory issues
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Show user-friendly error message for critical errors
    if (this.isCriticalError(error)) {
      toast.error(
        "Something went wrong. Please refresh the page if the issue persists."
      );
    }

    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      console.group(`🚨 ${type}`);
      console.error("Error:", error);
      console.error("Stack:", error?.stack);
      console.groupEnd();
    }
  }

  isCriticalError(error) {
    const criticalPatterns = [
      /network error/i,
      /failed to fetch/i,
      /connection refused/i,
      /timeout/i,
      /server error/i,
    ];

    const errorMessage = error?.message || error?.toString() || "";
    return criticalPatterns.some((pattern) => pattern.test(errorMessage));
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  // Report error to external service (placeholder)
  reportError(error) {
    // In production, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error);
      console.log("Error reported to monitoring service:", error);
    }
  }
}

// Create global instance
const errorMonitor = new ErrorMonitor();

// Export utilities
export const logError = (type, error) => errorMonitor.logError(type, error);
export const getErrors = () => errorMonitor.getErrors();
export const clearErrors = () => errorMonitor.clearErrors();

export default errorMonitor;
