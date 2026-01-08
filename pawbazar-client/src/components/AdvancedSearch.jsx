import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdvancedSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    query: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "relevance",
    order: "desc",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState({
    categories: [],
    locations: [],
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "dogs", label: "Dogs" },
    { value: "cats", label: "Cats" },
    { value: "birds", label: "Birds" },
    { value: "fish", label: "Fish" },
    { value: "food", label: "Pet Food" },
    { value: "accessories", label: "Accessories" },
    { value: "toys", label: "Toys" },
    { value: "healthcare", label: "Healthcare" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "date", label: "Date Added" },
    { value: "price", label: "Price" },
    { value: "name", label: "Name" },
    { value: "location", label: "Location" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPopularSearches();
    }
  }, [isOpen]);

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/search/popular`
      );
      const data = await response.json();
      if (data.success) {
        setPopularSearches(data.data);
      }
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/search/suggestions?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "query") {
      fetchSuggestions(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "category") {
      setSearchForm((prev) => ({
        ...prev,
        category: suggestion.text.toLowerCase(),
      }));
    } else if (suggestion.type === "location") {
      setSearchForm((prev) => ({
        ...prev,
        location: suggestion.text,
      }));
    } else {
      setSearchForm((prev) => ({
        ...prev,
        query: suggestion.text,
      }));
    }
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build search URL with parameters
    const params = new URLSearchParams();

    Object.entries(searchForm).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "relevance") {
        params.append(key, value);
      }
    });

    navigate(`/pets-supplies?${params.toString()}`);
    onClose();
  };

  const clearForm = () => {
    setSearchForm({
      query: "",
      category: "all",
      minPrice: "",
      maxPrice: "",
      location: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "relevance",
      order: "desc",
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Advanced Search</h2>
            <button onClick={onClose} className="btn btn-ghost btn-circle">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search Query */}
            <div className="relative">
              <label className="label">
                <span className="label-text font-medium">Search Keywords</span>
              </label>
              <input
                type="text"
                name="query"
                value={searchForm.query}
                onChange={handleInputChange}
                placeholder="Search for pets, supplies, breeds..."
                className="input input-bordered w-full"
                onFocus={() =>
                  searchForm.query.length >= 2 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-base-200 flex items-center justify-between"
                    >
                      <span>{suggestion.text}</span>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-sm badge-outline">
                          {suggestion.type}
                        </span>
                        <span className="text-xs text-base-content/60">
                          {suggestion.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  name="category"
                  value={searchForm.category}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  placeholder="City, area, or region"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Price Range</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="minPrice"
                  value={searchForm.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min price"
                  className="input input-bordered"
                  min="0"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={searchForm.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max price"
                  className="input input-bordered"
                  min="0"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Date Range</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="dateFrom"
                  value={searchForm.dateFrom}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
                <input
                  type="date"
                  name="dateTo"
                  value={searchForm.dateTo}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">Sort By</span>
                </label>
                <select
                  name="sortBy"
                  value={searchForm.sortBy}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Order</span>
                </label>
                <select
                  name="order"
                  value={searchForm.order}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {/* Popular Searches */}
            {(popularSearches.categories.length > 0 ||
              popularSearches.locations.length > 0) && (
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Popular Searches
                  </span>
                </label>
                <div className="space-y-3">
                  {popularSearches.categories.length > 0 && (
                    <div>
                      <p className="text-sm text-base-content/70 mb-2">
                        Popular Categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.categories
                          .slice(0, 5)
                          .map((category, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                setSearchForm((prev) => ({
                                  ...prev,
                                  category: category.text.toLowerCase(),
                                }))
                              }
                              className="badge badge-outline hover:badge-primary cursor-pointer"
                            >
                              {category.text} ({category.count})
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {popularSearches.locations.length > 0 && (
                    <div>
                      <p className="text-sm text-base-content/70 mb-2">
                        Popular Locations:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.locations
                          .slice(0, 5)
                          .map((location, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                setSearchForm((prev) => ({
                                  ...prev,
                                  location: location.text,
                                }))
                              }
                              className="badge badge-outline hover:badge-secondary cursor-pointer"
                            >
                              {location.text} ({location.count})
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={clearForm}
                className="btn btn-ghost"
              >
                Clear All
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
