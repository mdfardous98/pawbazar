import { useState, useEffect } from "react";
import { ordersAPI } from "../services/api";
import toast from "react-hot-toast";

export const useOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchOrders = async (searchParams = params) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getMyOrders(searchParams);

      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const refetch = (newParams = {}) => {
    fetchOrders({ ...params, ...newParams });
  };

  const cancelOrder = async (id) => {
    try {
      await ordersAPI.updateOrderStatus(id, "cancelled");
      toast.success("Order cancelled successfully");

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
      toast.error(err.response?.data?.message || "Failed to cancel order");
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    pagination,
    refetch,
    cancelOrder,
  };
};

export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ordersAPI.getOrder(id);
        setOrder(response.data.order);
        setProduct(response.data.product);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.response?.data?.message || "Failed to fetch order");
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return { order, product, loading, error };
};

export const useOrderStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ordersAPI.getOrderStats();
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching order stats:", err);
        setError(
          err.response?.data?.message || "Failed to fetch order statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.createOrder(orderData);
      toast.success("Order placed successfully!");

      return response.data;
    } catch (err) {
      console.error("Error creating order:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to place order";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error,
  };
};
