import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useListings } from "../hooks/useListings";
import ListingCard from "../components/ListingCard";
import SearchFilters from "../components/SearchFilters";

const PetsSupplies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    sort: searchParams.get("sort") || "date",
    order: searchParams.get("order") || "desc",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const { listings, loading, error, pagination, refetch } =
    useListings(filters);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== 1) {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    { value: "date", label: "Latest First" },
    { value: "price", label: "Price" },
    { value: "name", label: "Name" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Pets & Supplies</h1>
          <p className="text-lg opacity-90">
            Find your perfect companion or everything you need for your furry
            friends
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <SearchFilters
              filters={filters}
              categories={categories}
              sortOptions={sortOptions}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                {pagination && (
                  <p className="text-base-content/70">
                    Showing{" "}
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                    -{" "}
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} results
                  </p>
                )}
              </div>

              {/* Mobile Sort */}
              <div className="sm:hidden mt-4 w-full">
                <select
                  className="select select-bordered w-full"
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    handleFilterChange({ sort, order });
                  }}
                >
                  <option value="date-desc">Latest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="alert alert-error mb-6">
                <svg
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => refetch()}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card bg-base-100 shadow-xl">
                    <div className="skeleton h-48 w-full"></div>
                    <div className="card-body">
                      <div className="skeleton h-4 w-3/4 mb-2"></div>
                      <div className="skeleton h-3 w-1/2 mb-4"></div>
                      <div className="skeleton h-16 w-full mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="skeleton h-4 w-1/3"></div>
                        <div className="skeleton h-8 w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <>
                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="join">
                      <button
                        className="join-item btn"
                        disabled={!pagination.hasPrev}
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                      >
                        «
                      </button>

                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === pagination.currentPage;

                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= pagination.currentPage - 1 &&
                            page <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              className={`join-item btn ${
                                isCurrentPage ? "btn-active" : ""
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === pagination.currentPage - 2 ||
                          page === pagination.currentPage + 2
                        ) {
                          return (
                            <button
                              key={page}
                              className="join-item btn btn-disabled"
                            >
                              ...
                            </button>
                          );
                        }
                        return null;
                      })}

                      <button
                        className="join-item btn"
                        disabled={!pagination.hasNext}
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-2">
                  No listings found
                </h3>
                <p className="text-base-content/70 mb-6">
                  {filters.search || filters.category !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Be the first to add a listing!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {(filters.search || filters.category !== "all") && (
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        handleFilterChange({ search: "", category: "all" })
                      }
                    >
                      Clear Filters
                    </button>
                  )}
                  <button className="btn btn-primary">Add Listing</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsSupplies;
