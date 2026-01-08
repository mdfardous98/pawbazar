import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";
import FavoriteButton from "./FavoriteButton";

const ListingCard = ({ listing, index = 0, showFavorite = true }) => {
  const formatPrice = (price) => {
    if (price === 0) return "Free";
    return `৳${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
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

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="badge badge-primary capitalize">
            {listing.category}
          </span>
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <div className="absolute top-2 right-2">
            <FavoriteButton listingId={listing._id} />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-2 right-2">
          <span
            className={`badge ${
              listing.price === 0 ? "badge-success" : "badge-warning"
            } font-bold`}
          >
            {formatPrice(listing.price)}
          </span>
        </div>
      </figure>

      <div className="card-body p-4">
        <h3 className="card-title text-lg font-semibold line-clamp-2 mb-2">
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

        <p className="text-base-content/80 text-sm line-clamp-3 mb-3">
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-xs text-base-content/60 mb-4">
          <span>Posted {formatDate(listing.date)}</span>
          <span>By {listing.email.split("@")[0]}</span>
        </div>

        <div className="card-actions justify-between items-center">
          <Link
            to={`/listing/${listing._id}`}
            className="btn btn-primary btn-sm flex-1"
          >
            View Details
          </Link>

          <div className="flex gap-1">
            <button
              className="btn btn-ghost btn-sm btn-circle"
              title="Contact seller"
            >
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            <button
              className="btn btn-ghost btn-sm btn-circle"
              title="Share listing"
            >
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
