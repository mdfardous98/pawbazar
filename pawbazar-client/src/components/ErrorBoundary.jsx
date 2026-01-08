import React from "react";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // You can also log the error to an error reporting service here
    if (process.env.NODE_ENV === "production") {
      // Log to error reporting service
      // Example: Sentry.captureException(error);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="text-8xl mb-6">😵</div>

            <h1 className="text-3xl font-bold text-base-content mb-4">
              Oops! Something went wrong
            </h1>

            <p className="text-base-content/70 mb-6">
              We're sorry, but something unexpected happened. Our team has been
              notified and is working to fix the issue.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleReload}
                className="btn btn-primary w-full"
              >
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="btn btn-outline w-full"
              >
                Go to Homepage
              </button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-base-200 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="text-xs bg-base-300 p-2 rounded mt-1 overflow-auto">
                      {this.state.error && this.state.error.toString()}
                    </pre>
                  </div>
                  <div>
                    <strong>Stack Trace:</strong>
                    <pre className="text-xs bg-base-300 p-2 rounded mt-1 overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="mt-6 text-xs text-base-content/50">
              Error ID: {Date.now().toString(36)}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, fallback = null) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

export default ErrorBoundary;
