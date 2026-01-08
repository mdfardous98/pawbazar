import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useListing } from "../hooks/useListings";
import { useAuth } from "../contexts/AuthContext";
import { useCreateOrder } from "../hooks/useOrders";
import OrderModal from "../components/OrderModal";
import toast from "react-hot-toast";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { listing, relatedListings, loading, error } = useListing(id);
  const { createOrder } = useCreateOrder();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return price === 0 ? "Free Adoption" : `৳${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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
    return icons[category?.toLowerCase()] || "🐾";
  };

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      navigate("/login", { state: { from: { pathname: `/listing/${id}` } } });
      return;
    }
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async (orderData) => {
    try {
      await createOrder({
        productId: listing._id,
        productName: listing.name,
        ...orderData,
      });
      setShowOrderModal(false);
      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Skeleton */}
              <div className="skeleton h-96 w-full rounded-lg"></div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                <div className="skeleton h-8 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-6 w-1/3"></div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-12 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-base-content/70 mb-4">
            {error || "The listing you are looking for does not exist."}
          </p>
          <Link to="/pets-supplies" className="btn btn-primary">
            Browse All Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Breadcrumb */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-4">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/pets-supplies">Pets & Supplies</Link>
              </li>
              <li>
                <Link to={`/pets-supplies?category=${listing.category}`}>
                  {listing.category}
                </Link>
              </li>
              <li className="opacity-70">{listing.name}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                {imageError ? (
                  <div className="h-96 bg-base-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {getCategoryIcon(listing.category)}
                      </div>
                      <p className="text-base-content/50">
                        Image not available
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                    onError={() => setImageError(true)}
                  />
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <div className="badge badge-primary">
                    {getCategoryIcon(listing.category)} {listing.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.name}</h1>
                <div className="flex items-center gap-4 text-base-content/70 mb-4">
                  <span className="flex items-center">
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
                    {listing.location}
                  </span>
                  <span className="flex items-center">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(listing.date)}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="card bg-primary/10 border border-primary/20">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Price</span>
                    <span
                      className={`text-2xl font-bold ${
                        listing.price === 0 ? "text-success" : "text-primary"
                      }`}
                    >
                      {formatPrice(listing.price)}
                    </span>
                  </div>
                  {listing.price === 0 && (
                    <p className="text-sm text-success/70 mt-2">
                      This is a free adoption - help give this pet a loving
                      home! 💚
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    <span className="text-sm">{listing.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOrderClick}
                  className="btn btn-primary btn-lg w-full"
                >
                  {listing.price === 0 ? "🏠 Adopt Now" : "🛒 Order Now"}
                </button>

                <div className="flex gap-2">
                  <button className="btn btn-outline flex-1">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Save
                  </button>
                  <button className="btn btn-outline flex-1">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Listings */}
          {relatedListings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Listings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedListings.map((relatedListing) => (
                  <Link
                    key={relatedListing._id}
                    to={`/listing/${relatedListing._id}`}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    <figure>
                      <img
                        src={relatedListing.image}
                        alt={relatedListing.name}
                        className="h-32 w-full object-cover"
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-size="30">${getCategoryIcon(
                            relatedListing.category
                          )}</text></svg>`;
                        }}
                      />
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="card-title text-sm line-clamp-1">
                        {relatedListing.name}
                      </h3>
                      <p className="text-xs text-base-content/70">
                        {relatedListing.location}
                      </p>
                      <div className="text-sm font-bold text-primary">
                        {formatPrice(relatedListing.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          listing={listing}
          user={user}
          onSubmit={handleOrderSubmit}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
};

export default ListingDetails;
