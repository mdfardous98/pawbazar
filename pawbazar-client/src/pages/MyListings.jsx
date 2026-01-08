import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMyListings } from "../hooks/useListings";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const MyListings = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { listings, loading, error, pagination, refetch, deleteListing } =
    useMyListings({ page: currentPage });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const formatPrice = (price) => {
    return price === 0 ? "Free Adoption" : `৳${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dogs: "🐕",
      cats: "🐱",
      birds: "🐦",
      fish: "🐠",
      food: "🥘",
      accessories: "🎾",
      toys: "🧸",
      healthcare: "💊",
    };
    return icons[category.toLowerCase()] || "🐾";
  };

  const handleDelete = async (id) => {
    try {
      await deleteListing(id);
      setDeleteConfirm(null);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-lg opacity-90">
                Manage your pet and supply listings
              </p>
            </div>
            <Link to="/add-listing" className="btn btn-secondary mt-4 sm:mt-0">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Listing
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        {pagination && (
          <div className="stats shadow mb-8">
            <div className="stat">
              <div className="stat-title">Total Listings</div>
              <div className="stat-value text-primary">
                {pagination.totalItems}
              </div>
              <div className="stat-desc">Your active listings</div>
            </div>
            <div className="stat">
              <div className="stat-title">This Page</div>
              <div className="stat-value text-secondary">{listings.length}</div>
              <div className="stat-desc">
                of {pagination.itemsPerPage} per page
              </div>
            </div>
          </div>
        )}

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
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center space-x-4">
                    <div className="skeleton w-24 h-24 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-3/4"></div>
                      <div className="skeleton h-3 w-1/2"></div>
                      <div className="skeleton h-3 w-1/4"></div>
                    </div>
                    <div className="skeleton w-20 h-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            {/* Listings Table/Cards */}
            <div className="space-y-4 mb-8">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="card-body">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                      {/* Image */}
                      <div className="w-full lg:w-24 h-48 lg:h-24 rounded-lg overflow-hidden bg-base-200 flex-shrink-0">
                        <img
                          src={listing.image}
                          alt={listing.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="40">${getCategoryIcon(
                              listing.category
                            )}</text></svg>`;
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold truncate">
                              {listing.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                              <span className="flex items-center">
                                {getCategoryIcon(listing.category)}{" "}
                                {listing.category}
                              </span>
                              <span className="flex items-center">
                                📍 {listing.location}
                              </span>
                              <span>📅 {formatDate(listing.date)}</span>
                            </div>
                            <p className="text-sm text-base-content/80 mt-2 line-clamp-2">
                              {listing.description}
                            </p>
                          </div>

                          <div className="flex flex-col sm:items-end gap-2">
                            <span
                              className={`text-lg font-bold ${
                                listing.price === 0
                                  ? "text-success"
                                  : "text-primary"
                              }`}
                            >
                              {formatPrice(listing.price)}
                            </span>
                            <div className="flex gap-2">
                              <Link
                                to={`/listing/${listing._id}`}
                                className="btn btn-sm btn-outline"
                              >
                                View
                              </Link>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  // TODO: Implement edit functionality
                                  toast.info("Edit functionality coming soon!");
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => setDeleteConfirm(listing._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="join">
                  <button
                    className="join-item btn"
                    disabled={!pagination.hasPrev}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    «
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.currentPage;

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
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
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
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2">No listings yet</h3>
            <p className="text-base-content/70 mb-6">
              Create your first listing to start sharing pets and supplies with
              the community
            </p>
            <Link to="/add-listing" className="btn btn-primary btn-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create First Listing
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
