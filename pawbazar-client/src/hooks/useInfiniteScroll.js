import { useState, useEffect, useCallback } from "react";

// Custom hook for infinite scrolling
export const useInfiniteScroll = (fetchMore, hasMore = true) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreData();
  }, [isFetching]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching ||
      !hasMore
    )
      return;
    setIsFetching(true);
  };

  const fetchMoreData = useCallback(async () => {
    try {
      await fetchMore();
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchMore]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
