import { Link } from "react-router-dom";
import { useState } from "react";

const ListingCard = ({ listing }) => {
  const [imageError, setImageError] = useState(false);

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

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <figure className="relative">
        {imageError ? (
          <div className="h-48 w-full bg-base-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {getCategoryIcon(listing.category)}
              </div>
              <p className="text-sm text-base-content/50">
                Image not available
              </p>
            </div>
          </div>
        ) : (
          <img
            src={listing.image}
            alt={listing.name}
            className="h-48 w-full object-cover"
            onError={handleImageError}
          />
        )}

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <div className="badge badge-primary badge-sm">
            {getCategoryIcon(listing.category)} {listing.category}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <div
            className={`badge badge-sm ${
              listing.price === 0 ? "badge-success" : "badge-secondary"
            }`}
          >
            {formatPrice(listing.price)}
          </div>
        </div>
      </figure>

      <div className="card-body p-4">
        <h3 className="card-title text-lg line-clamp-1" title={listing.name}>
          {listing.name}
        </h3>

        <div className="flex items-center text-sm text-base-content/70 mb-2">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{listing.location}</span>
        </div>

        <p
          className="text-sm text-base-content/80 line-clamp-2 mb-3"
          title={listing.description}
        >
          {listing.description}
        </p>

        <div className="flex items-center justify-between text-xs text-base-content/60 mb-4">
          <span>Posted {formatDate(listing.date)}</span>
          <span className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {listing.email?.split("@")[0] || "Anonymous"}
          </span>
        </div>

        <div className="card-actions justify-between items-center">
          <div className="text-lg font-bold">
            <span
              className={listing.price === 0 ? "text-success" : "text-primary"}
            >
              {formatPrice(listing.price)}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/listing/${listing._id}`}
              className="btn btn-primary btn-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
