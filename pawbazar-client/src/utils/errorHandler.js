import toast from "react-hot-toast";

// Centralized error handling utility
export const handleApiError = (error, customMessage = null) => {
  console.error("API Error:", error);

  let errorMessage = customMessage || "An unexpected error occurred";

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        errorMessage = data.message || "Invalid request";
        break;
      case 401:
        errorMessage = "Please log in to continue";
        // Redirect to login if needed
        if (window.location.pathname !== "/login") {
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
        break;
      case 403:
        errorMessage = "You don't have permission to perform this action";
        break;
      case 404:
        errorMessage = data.message || "Resource not found";
        break;
      case 429:
        errorMessage = "Too many requests. Please try again later";
        break;
      case 500:
        errorMessage = "Server error. Please try again later";
        break;
      default:
        errorMessage =
          data.message || `Error ${status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Network error
    errorMessage = "Network error. Please check your connection";
  } else {
    // Other error
    errorMessage = error.message || "Something went wrong";
  }

  toast.error(errorMessage);
  return errorMessage;
};

// Validation error handler
export const handleValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    errors.forEach((error) => toast.error(error));
  } else if (typeof errors === "object") {
    Object.values(errors).forEach((error) => toast.error(error));
  } else {
    toast.error(errors || "Validation failed");
  }
};

// Success message handler
export const handleSuccess = (message, duration = 4000) => {
  toast.success(message, { duration });
};

// Loading state handler
export const handleLoading = (message = "Loading...") => {
  return toast.loading(message);
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export default {
  handleApiError,
  handleValidationErrors,
  handleSuccess,
  handleLoading,
  dismissToast,
};
