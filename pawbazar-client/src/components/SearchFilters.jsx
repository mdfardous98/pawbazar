import { useState } from "react";

const SearchFilters = ({
  filters,
  categories,
  sortOptions,
  onFilterChange,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search: localSearch });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ category });
  };

  const handleSortChange = (sort, order) => {
    onFilterChange({ sort, order });
  };

  const clearFilters = () => {
    setLocalSearch("");
    onFilterChange({
      search: "",
      category: "all",
      sort: "date",
      order: "desc",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.sort !== "date" ||
    filters.order !== "desc";

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-ghost btn-sm text-primary"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="label">
          <span className="label-text font-medium">Search</span>
        </label>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search pets, supplies..."
            className="input input-bordered flex-1"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="label">
          <span className="label-text font-medium">Category</span>
        </label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.value}
              className="cursor-pointer label justify-start gap-3"
            >
              <input
                type="radio"
                name="category"
                className="radio radio-primary radio-sm"
                checked={filters.category === category.value}
                onChange={() => handleCategoryChange(category.value)}
              />
              <span className="label-text">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options - Desktop */}
      <div className="hidden sm:block mb-6">
        <label className="label">
          <span className="label-text font-medium">Sort By</span>
        </label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <div key={option.value} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              <div className="flex gap-2">
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="radio"
                    name="sort"
                    className="radio radio-primary radio-sm"
                    checked={
                      filters.sort === option.value && filters.order === "desc"
                    }
                    onChange={() => handleSortChange(option.value, "desc")}
                  />
                  <span className="label-text text-xs">
                    {option.value === "date"
                      ? "Newest"
                      : option.value === "price"
                      ? "High to Low"
                      : "Z to A"}
                  </span>
                </label>
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="radio"
                    name="sort"
                    className="radio radio-primary radio-sm"
                    checked={
                      filters.sort === option.value && filters.order === "asc"
                    }
                    onChange={() => handleSortChange(option.value, "asc")}
                  />
                  <span className="label-text text-xs">
                    {option.value === "date"
                      ? "Oldest"
                      : option.value === "price"
                      ? "Low to High"
                      : "A to Z"}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="label">
          <span className="label-text font-medium">Price Range</span>
        </label>
        <div className="space-y-2">
          <label className="cursor-pointer label justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              onChange={(e) => {
                // This would need additional logic to filter by price range
                console.log("Free adoption filter:", e.target.checked);
              }}
            />
            <span className="label-text">Free Adoption</span>
          </label>
          <label className="cursor-pointer label justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              onChange={(e) => {
                console.log("Under ৳1000 filter:", e.target.checked);
              }}
            />
            <span className="label-text">Under ৳1,000</span>
          </label>
          <label className="cursor-pointer label justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              onChange={(e) => {
                console.log("৳1000-৳5000 filter:", e.target.checked);
              }}
            />
            <span className="label-text">৳1,000 - ৳5,000</span>
          </label>
          <label className="cursor-pointer label justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
              onChange={(e) => {
                console.log("Above ৳5000 filter:", e.target.checked);
              }}
            />
            <span className="label-text">Above ৳5,000</span>
          </label>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <button
            className="btn btn-outline btn-sm w-full justify-start"
            onClick={() => handleCategoryChange("dogs")}
          >
            🐕 Browse Dogs
          </button>
          <button
            className="btn btn-outline btn-sm w-full justify-start"
            onClick={() => handleCategoryChange("cats")}
          >
            🐱 Browse Cats
          </button>
          <button
            className="btn btn-outline btn-sm w-full justify-start"
            onClick={() =>
              onFilterChange({
                search: "",
                category: "all",
                sort: "price",
                order: "asc",
              })
            }
          >
            💰 Free Adoptions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
