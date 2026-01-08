import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { favoritesAPI } from "../services/api";
import toast from "react-hot-toast";

const FavoriteButton = ({ listingId, className = "" }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && listingId) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, listingId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoritesAPI.checkFavorite(listingId);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.removeFromFavorites(listingId);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await favoritesAPI.addToFavorites(listingId);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error(
        isFavorite
          ? "Failed to remove from favorites"
          : "Failed to add to favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`btn btn-circle btn-sm ${
        isFavorite
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
          : "bg-base-100 hover:bg-red-50 text-red-500 border-red-200"
      } ${loading ? "loading" : ""} ${className}`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {!loading && (
        <svg
          className="w-4 h-4"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default FavoriteButton;
