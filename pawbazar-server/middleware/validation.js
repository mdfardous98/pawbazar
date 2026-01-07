// Validation middleware for request data
export const validateListing = (req, res, next) => {
  const { name, category, price, location, description, image } = req.body;
  const errors = [];

  // Required fields validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long");
  }

  if (!category || category.trim().length === 0) {
    errors.push("Category is required");
  }

  if (price === undefined || price === null) {
    errors.push("Price is required");
  } else if (isNaN(price) || price < 0) {
    errors.push("Price must be a valid non-negative number");
  }

  if (!location || location.trim().length === 0) {
    errors.push("Location is required");
  }

  if (!description || description.trim().length === 0) {
    errors.push("Description is required");
  } else if (description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  }

  if (!image || image.trim().length === 0) {
    errors.push("Image URL is required");
  } else if (!isValidUrl(image)) {
    errors.push("Image must be a valid URL");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Please fix the following errors",
      errors,
    });
  }

  // Sanitize data
  req.body.name = name.trim();
  req.body.category = category.trim();
  req.body.price = parseFloat(price);
  req.body.location = location.trim();
  req.body.description = description.trim();
  req.body.image = image.trim();

  next();
};

export const validateOrder = (req, res, next) => {
  const {
    productId,
    productName,
    buyerName,
    email,
    quantity,
    price,
    address,
    phone,
  } = req.body;
  const errors = [];

  // Required fields validation
  if (!productId || productId.trim().length === 0) {
    errors.push("Product ID is required");
  }

  if (!productName || productName.trim().length === 0) {
    errors.push("Product name is required");
  }

  if (!buyerName || buyerName.trim().length === 0) {
    errors.push("Buyer name is required");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!isValidEmail(email)) {
    errors.push("Email must be valid");
  }

  if (!quantity || isNaN(quantity) || quantity < 1) {
    errors.push("Quantity must be a positive number");
  }

  if (price === undefined || price === null || isNaN(price) || price < 0) {
    errors.push("Price must be a valid non-negative number");
  }

  if (!address || address.trim().length === 0) {
    errors.push("Address is required");
  }

  if (!phone || phone.trim().length === 0) {
    errors.push("Phone number is required");
  } else if (!isValidPhone(phone)) {
    errors.push("Phone number must be valid");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Please fix the following errors",
      errors,
    });
  }

  // Sanitize data
  req.body.productId = productId.trim();
  req.body.productName = productName.trim();
  req.body.buyerName = buyerName.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.quantity = parseInt(quantity);
  req.body.price = parseFloat(price);
  req.body.address = address.trim();
  req.body.phone = phone.trim();
  if (req.body.additionalNotes) {
    req.body.additionalNotes = req.body.additionalNotes.trim();
  }

  next();
};

// Helper functions
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  // Basic phone validation - adjust regex based on your requirements
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};
