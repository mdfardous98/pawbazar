import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { favoritesAPI } from "../services/api";
import SkeletonLoader from "../components/SkeletonLoader";
import OptimizedImage from "../components/OptimizedImage";
import toast from "react-hot-toast";

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoritesAPI.getFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites");
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (listingId) => {
    try {
      await favoritesAPI.removeFromFavorites(listingId);
      setFavorites(favorites.filter((fav) => fav._id !== listingId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">
              My Favorites
            </h1>
            <p className="text-base-content/70">Your saved listings and pets</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoader key={index} type="card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-base-content/70 mb-6">{error}</p>
            <button onClick={fetchFavorites} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-base-content mb-2">
            My Favorites ❤️
          </h1>
          <p className="text-base-content/70">
            Your saved listings and pets ({favorites.length} items)
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              No favorites yet
            </h2>
            <p className="text-base-content/70 mb-6">
              Start exploring and save your favorite pets and supplies!
            </p>
            <Link to="/pets-supplies" className="btn btn-primary">
              Browse Listings
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {favorites.map((listing, index) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <figure className="relative overflow-hidden">
                  <OptimizedImage
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleRemoveFromFavorites(listing._id)}
                      className="btn btn-circle btn-sm bg-red-500 hover:bg-red-600 text-white border-none"
                      title="Remove from favorites"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="badge badge-primary">
                      {listing.category}
                    </span>
                  </div>
                </figure>

                <div className="card-body p-4">
                  <h3 className="card-title text-lg font-semibold line-clamp-2">
                    {listing.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-base-content/70 mb-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {listing.location}
                  </div>

                  <p className="text-base-content/80 text-sm line-clamp-2 mb-3">
                    {listing.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-primary">
                      {listing.price === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${listing.price}`
                      )}
                    </div>
                    <div className="text-xs text-base-content/60">
                      Added {formatDate(listing.favoriteDate)}
                    </div>
                  </div>

                  <div className="card-actions justify-between items-center">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/pets-supplies" className="btn btn-outline">
                  Browse More
                </Link>
                <Link to="/add-listing" className="btn btn-primary">
                  Add Listing
                </Link>
                <Link to="/my-orders" className="btn btn-secondary">
                  My Orders
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
