import { useState, useEffect } from "react";
import { listingsAPI } from "../services/api";
import toast from "react-hot-toast";

export const useListings = (params = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchListings = async (searchParams = params) => {
    try {
      setLoading(true);
      setError(null);

      const response = await listingsAPI.getListings(searchParams);

      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.response?.data?.message || "Failed to fetch listings");
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const refetch = (newParams = {}) => {
    fetchListings({ ...params, ...newParams });
  };

  return {
    listings,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useRecentListings = (limit = 6) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await listingsAPI.getRecentListings(limit);
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching recent listings:", err);
        setError(
          err.response?.data?.message || "Failed to fetch recent listings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentListings();
  }, [limit]);

  return { listings, loading, error };
};

export const useListing = (id) => {
  const [listing, setListing] = useState(null);
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await listingsAPI.getListing(id);
        setListing(response.data.listing);
        setRelatedListings(response.data.related || []);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err.response?.data?.message || "Failed to fetch listing");
        toast.error("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, relatedListings, loading, error };
};

export const useMyListings = (params = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchMyListings = async (searchParams = params) => {
    try {
      setLoading(true);
      setError(null);

      const response = await listingsAPI.getMyListings(searchParams);

      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching my listings:", err);
      setError(err.response?.data?.message || "Failed to fetch your listings");
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const refetch = (newParams = {}) => {
    fetchMyListings({ ...params, ...newParams });
  };

  const deleteListing = async (id) => {
    try {
      await listingsAPI.deleteListing(id);
      toast.success("Listing deleted successfully");

      // Remove from local state
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      console.error("Error deleting listing:", err);
      toast.error(err.response?.data?.message || "Failed to delete listing");
      throw err;
    }
  };

  return {
    listings,
    loading,
    error,
    pagination,
    refetch,
    deleteListing,
  };
};
