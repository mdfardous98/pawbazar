import { useState } from "react";

const OrderModal = ({ listing, user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    buyerName: user?.displayName || "",
    email: user?.email || "",
    quantity: listing?.category === "pets" ? 1 : 1,
    price: listing?.price || 0,
    address: "",
    phone: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.buyerName.trim()) {
      newErrors.buyerName = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? "Free Adoption" : `৳${price.toLocaleString()}`;
  };

  const totalPrice = formData.quantity * formData.price;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">
            {listing.price === 0 ? "🏠 Adoption Request" : "🛒 Place Order"}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body p-4">
            <h4 className="font-semibold mb-3">Order Summary</h4>
            <div className="flex items-center gap-4">
              <img
                src={listing.image}
                alt={listing.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f3f4f6"/><text x="32" y="32" text-anchor="middle" dy=".3em" font-size="24">🐾</text></svg>`;
                }}
              />
              <div className="flex-1">
                <h5 className="font-medium">{listing.name}</h5>
                <p className="text-sm text-base-content/70">
                  {listing.location}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(listing.price)}{" "}
                  {formData.quantity > 1 && `× ${formData.quantity}`}
                </p>
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Buyer Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name *</span>
            </label>
            <input
              type="text"
              name="buyerName"
              placeholder="Enter your full name"
              className={`input input-bordered ${
                errors.buyerName ? "input-error" : ""
              }`}
              value={formData.buyerName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.buyerName && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.buyerName}
                </span>
              </label>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email Address *</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`input input-bordered ${
                errors.email ? "input-error" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.email}
                </span>
              </label>
            )}
          </div>

          {/* Quantity */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Quantity *</span>
              {listing.category === "pets" && (
                <span className="label-text-alt">Pets: 1 only</span>
              )}
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              max={listing.category === "pets" ? 1 : 10}
              className={`input input-bordered ${
                errors.quantity ? "input-error" : ""
              }`}
              value={formData.quantity}
              onChange={handleChange}
              disabled={isSubmitting || listing.category === "pets"}
            />
            {errors.quantity && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.quantity}
                </span>
              </label>
            )}
          </div>

          {/* Address */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Delivery Address *</span>
            </label>
            <textarea
              name="address"
              placeholder="Enter your complete address"
              className={`textarea textarea-bordered h-20 ${
                errors.address ? "textarea-error" : ""
              }`}
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.address && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.address}
                </span>
              </label>
            )}
          </div>

          {/* Phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Phone Number *</span>
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g., +8801712345678"
              className={`input input-bordered ${
                errors.phone ? "input-error" : ""
              }`}
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.phone}
                </span>
              </label>
            )}
          </div>

          {/* Additional Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Additional Notes</span>
              <span className="label-text-alt">Optional</span>
            </label>
            <textarea
              name="additionalNotes"
              placeholder="Any special instructions or questions..."
              className="textarea textarea-bordered h-20"
              value={formData.additionalNotes}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Important Notice */}
          {listing.price === 0 && (
            <div className="alert alert-info">
              <svg
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Adoption Guidelines</h3>
                <div className="text-xs">
                  Please ensure you can provide a loving, permanent home. The
                  owner may ask questions about your living situation.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {listing.price === 0
                    ? "Submitting Request..."
                    : "Placing Order..."}
                </>
              ) : listing.price === 0 ? (
                "Submit Adoption Request"
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
