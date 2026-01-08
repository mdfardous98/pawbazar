// Validation utility functions
export const validators = {
  required: (value, message = "This field is required") => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return message;
    }
    return null;
  },

  email: (value, message = "Please enter a valid email address") => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  phone: (value, message = "Please enter a valid phone number") => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return message || `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return message || `Must be no more than ${max} characters long`;
    }
    return null;
  },

  pattern:
    (regex, message = "Invalid format") =>
    (value) => {
      if (!value) return null;
      if (!regex.test(value)) {
        return message;
      }
      return null;
    },

  url: (value, message = "Please enter a valid URL") => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  number: (value, message = "Please enter a valid number") => {
    if (!value) return null;
    if (isNaN(value)) {
      return message;
    }
    return null;
  },

  min: (min, message) => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < min) {
      return message || `Must be at least ${min}`;
    }
    return null;
  },

  max: (max, message) => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num > max) {
      return message || `Must be no more than ${max}`;
    }
    return null;
  },

  password: (
    value,
    message = "Password must be at least 8 characters with uppercase, lowercase, and number"
  ) => {
    if (!value) return null;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      return message;
    }
    return null;
  },

  confirmPassword:
    (originalPassword, message = "Passwords do not match") =>
    (value) => {
      if (!value) return null;
      if (value !== originalPassword) {
        return message;
      }
      return null;
    },

  fileSize: (maxSizeInMB, message) => (file) => {
    if (!file) return null;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return message || `File size must be less than ${maxSizeInMB}MB`;
    }
    return null;
  },

  fileType: (allowedTypes, message) => (file) => {
    if (!file) return null;
    if (!allowedTypes.includes(file.type)) {
      return message || `File type must be one of: ${allowedTypes.join(", ")}`;
    }
    return null;
  },

  custom: (validatorFn, message) => (value) => {
    if (!validatorFn(value)) {
      return message;
    }
    return null;
  },
};

// Form validation class
export class FormValidator {
  constructor(rules = {}) {
    this.rules = rules;
    this.errors = {};
  }

  // Add validation rule for a field
  addRule(fieldName, validatorFunctions) {
    this.rules[fieldName] = Array.isArray(validatorFunctions)
      ? validatorFunctions
      : [validatorFunctions];
    return this;
  }

  // Validate a single field
  validateField(fieldName, value) {
    const fieldRules = this.rules[fieldName];
    if (!fieldRules) return null;

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        this.errors[fieldName] = error;
        return error;
      }
    }

    delete this.errors[fieldName];
    return null;
  }

  // Validate all fields
  validate(data) {
    this.errors = {};
    let isValid = true;

    for (const [fieldName, fieldRules] of Object.entries(this.rules)) {
      const value = data[fieldName];
      const error = this.validateField(fieldName, value);
      if (error) {
        isValid = false;
      }
    }

    return {
      isValid,
      errors: { ...this.errors },
    };
  }

  // Get error for a specific field
  getError(fieldName) {
    return this.errors[fieldName] || null;
  }

  // Check if form has any errors
  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  // Clear all errors
  clearErrors() {
    this.errors = {};
  }

  // Clear error for specific field
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
  }
}

// Predefined validation schemas
export const validationSchemas = {
  // User registration
  registration: new FormValidator({
    displayName: [
      validators.required("Display name is required"),
      validators.minLength(2, "Display name must be at least 2 characters"),
      validators.maxLength(50, "Display name must be less than 50 characters"),
    ],
    email: [validators.required("Email is required"), validators.email()],
    password: [
      validators.required("Password is required"),
      validators.password(),
    ],
    confirmPassword: [
      validators.required("Please confirm your password"),
      // Note: confirmPassword validation needs to be handled separately with access to password value
    ],
  }),

  // Pet listing
  listing: new FormValidator({
    name: [
      validators.required("Pet name is required"),
      validators.minLength(2, "Pet name must be at least 2 characters"),
      validators.maxLength(100, "Pet name must be less than 100 characters"),
    ],
    category: [validators.required("Category is required")],
    price: [
      validators.required("Price is required"),
      validators.number(),
      validators.min(0, "Price cannot be negative"),
    ],
    location: [
      validators.required("Location is required"),
      validators.minLength(2, "Location must be at least 2 characters"),
    ],
    description: [
      validators.required("Description is required"),
      validators.minLength(10, "Description must be at least 10 characters"),
      validators.maxLength(
        1000,
        "Description must be less than 1000 characters"
      ),
    ],
    image: [
      validators.required("Image is required"),
      validators.url("Please enter a valid image URL"),
    ],
  }),

  // Order form
  order: new FormValidator({
    buyerName: [
      validators.required("Name is required"),
      validators.minLength(2, "Name must be at least 2 characters"),
    ],
    email: [validators.required("Email is required"), validators.email()],
    phone: [
      validators.required("Phone number is required"),
      validators.phone(),
    ],
    address: [
      validators.required("Address is required"),
      validators.minLength(10, "Please provide a complete address"),
    ],
    quantity: [
      validators.required("Quantity is required"),
      validators.number(),
      validators.min(1, "Quantity must be at least 1"),
    ],
  }),

  // Contact form
  contact: new FormValidator({
    name: [
      validators.required("Name is required"),
      validators.minLength(2, "Name must be at least 2 characters"),
    ],
    email: [validators.required("Email is required"), validators.email()],
    subject: [
      validators.required("Subject is required"),
      validators.minLength(5, "Subject must be at least 5 characters"),
    ],
    message: [
      validators.required("Message is required"),
      validators.minLength(10, "Message must be at least 10 characters"),
      validators.maxLength(1000, "Message must be less than 1000 characters"),
    ],
  }),

  // Profile update
  profile: new FormValidator({
    displayName: [
      validators.minLength(2, "Display name must be at least 2 characters"),
      validators.maxLength(50, "Display name must be less than 50 characters"),
    ],
    phone: [validators.phone()],
    location: [
      validators.minLength(2, "Location must be at least 2 characters"),
    ],
    bio: [validators.maxLength(500, "Bio must be less than 500 characters")],
  }),
};

// Utility function to create a validator with custom message
export const createValidator = (validatorFn, message) => {
  return (value) => (validatorFn(value) ? null : message);
};

// Utility function to combine multiple validators
export const combineValidators = (...validatorFns) => {
  return (value) => {
    for (const validator of validatorFns) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

export default FormValidator;
