import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { listingsAPI } from "../services/api";
import toast from "react-hot-toast";

const AddListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    location: "",
    description: "",
    image: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "dogs", label: "Dogs" },
    { value: "cats", label: "Cats" },
    { value: "birds", label: "Birds" },
    { value: "fish", label: "Fish" },
    { value: "food", label: "Pet Food" },
    { value: "accessories", label: "Accessories" },
    { value: "toys", label: "Toys" },
    { value: "healthcare", label: "Healthcare" },
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.price && formData.price !== "0") {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a valid number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);

    try {
      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await listingsAPI.createListing(listingData);

      toast.success("Listing created successfully!");
      navigate("/my-listings");
    } catch (error) {
      console.error("Error creating listing:", error);

      if (error.response?.data?.errors) {
        // Handle validation errors from server
        const serverErrors = {};
        error.response.data.errors.forEach((err) => {
          const field = err.toLowerCase().includes("name")
            ? "name"
            : err.toLowerCase().includes("category")
            ? "category"
            : err.toLowerCase().includes("price")
            ? "price"
            : err.toLowerCase().includes("location")
            ? "location"
            : err.toLowerCase().includes("description")
            ? "description"
            : err.toLowerCase().includes("image")
            ? "image"
            : "general";
          serverErrors[field] = err;
        });
        setErrors(serverErrors);
      }

      toast.error(error.response?.data?.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      category: "",
      price: "",
      location: "",
      description: "",
      image: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Listing</h1>
            <p className="text-base-content/70">
              Share your pet or pet supplies with the community
            </p>
          </div>

          {/* Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Golden Retriever Puppy, Premium Dog Food"
                    className={`input input-bordered ${
                      errors.name ? "input-error" : ""
                    }`}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.name}
                      </span>
                    </label>
                  )}
                </div>

                {/* Category */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Category *</span>
                  </label>
                  <select
                    name="category"
                    className={`select select-bordered ${
                      errors.category ? "select-error" : ""
                    }`}
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.category}
                      </span>
                    </label>
                  )}
                </div>

                {/* Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Price (৳) *</span>
                    <span className="label-text-alt">
                      Enter 0 for free adoption
                    </span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={`input input-bordered ${
                      errors.price ? "input-error" : ""
                    }`}
                    value={formData.price}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.price}
                      </span>
                    </label>
                  )}
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Location *</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Dhaka, Chittagong, Sylhet"
                    className={`input input-bordered ${
                      errors.location ? "input-error" : ""
                    }`}
                    value={formData.location}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.location && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.location}
                      </span>
                    </label>
                  )}
                </div>

                {/* Image URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Image URL *</span>
                    <span className="label-text-alt">
                      Use a direct image link
                    </span>
                  </label>
                  <input
                    type="url"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    className={`input input-bordered ${
                      errors.image ? "input-error" : ""
                    }`}
                    value={formData.image}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.image && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.image}
                      </span>
                    </label>
                  )}
                  {formData.image && isValidUrl(formData.image) && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Description *
                    </span>
                    <span className="label-text-alt">
                      {formData.description.length}/500
                    </span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your pet or product in detail..."
                    className={`textarea textarea-bordered h-32 ${
                      errors.description ? "textarea-error" : ""
                    }`}
                    maxLength="500"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.description}
                      </span>
                    </label>
                  )}
                </div>

                {/* Contact Info */}
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
                    <h3 className="font-bold">Contact Information</h3>
                    <div className="text-xs">
                      Your email ({user?.email}) will be used for contact
                      purposes.
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating Listing...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="btn btn-outline"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg">
                💡 Tips for a Great Listing
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Use clear, high-quality photos that show your pet or product
                  well
                </li>
                <li>
                  Write detailed descriptions including age, breed, temperament
                  (for pets)
                </li>
                <li>Be honest about any special needs or requirements</li>
                <li>
                  Set fair prices - remember adoption should be accessible
                </li>
                <li>Respond promptly to interested buyers/adopters</li>
                <li>Meet in safe, public places for transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
