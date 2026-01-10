import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { ordersAPI, listingsAPI } from "../services/api";
import SkeletonLoader from "../components/SkeletonLoader";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data for demo since API endpoints might not be fully connected
      const mockStats = {
        totalListings: 5,
        totalOrders: 12,
        totalRevenue: 8500,
        pendingOrders: 3,
      };

      const mockRecentOrders = [
        {
          _id: "1",
          productName: "Golden Retriever Puppy",
          buyerName: "John Doe",
          price: 0,
          status: "completed",
          date: "2024-01-08",
        },
        {
          _id: "2",
          productName: "Premium Dog Food",
          buyerName: "Sarah Ahmed",
          price: 2500,
          status: "pending",
          date: "2024-01-07",
        },
      ];

      const mockRecentListings = [
        {
          _id: "1",
          name: "Persian Cat - Female",
          category: "cats",
          price: 0,
          location: "Dhaka",
          date: "2024-01-08",
        },
        {
          _id: "2",
          name: "Interactive Dog Toy Set",
          category: "toys",
          price: 800,
          location: "Chittagong",
          date: "2024-01-07",
        },
      ];

      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setRecentListings(mockRecentListings);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return "Free";
    return `৳${price.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "cancelled":
        return "badge-error";
      default:
        return "badge-info";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <SkeletonLoader key={index} type="card" />
            ))}
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
            Dashboard 📊
          </h1>
          <p className="text-base-content/70">
            Welcome back, {user?.displayName || user?.email?.split("@")[0]}!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat bg-base-200 rounded-lg p-6"
          >
            <div className="stat-figure text-primary">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="stat-title">Total Listings</div>
            <div className="stat-value text-primary">{stats.totalListings}</div>
            <div className="stat-desc">Active listings</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat bg-base-200 rounded-lg p-6"
          >
            <div className="stat-figure text-secondary">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-secondary">{stats.totalOrders}</div>
            <div className="stat-desc">All time orders</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat bg-base-200 rounded-lg p-6"
          >
            <div className="stat-figure text-accent">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-accent">
              {formatPrice(stats.totalRevenue)}
            </div>
            <div className="stat-desc">From sales</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stat bg-base-200 rounded-lg p-6"
          >
            <div className="stat-figure text-warning">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="stat-title">Pending Orders</div>
            <div className="stat-value text-warning">{stats.pendingOrders}</div>
            <div className="stat-desc">Need attention</div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-base-200 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 bg-base-100 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{order.productName}</h3>
                    <p className="text-sm text-base-content/70">
                      by {order.buyerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(order.price)}
                    </div>
                    <span className={`badge ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Listings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-base-200 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>
            <div className="space-y-4">
              {recentListings.map((listing) => (
                <div
                  key={listing._id}
                  className="flex items-center justify-between p-4 bg-base-100 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{listing.name}</h3>
                    <p className="text-sm text-base-content/70">
                      {listing.category} • {listing.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(listing.price)}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {listing.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-base-200 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/add-listing" className="btn btn-primary">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Listing
            </a>
            <a href="/my-orders" className="btn btn-secondary">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View Orders
            </a>
            <a href="/messages" className="btn btn-accent">
              <svg
                className="w-5 h-5 mr-2"
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
              Messages
            </a>
            <a href="/pets-supplies" className="btn btn-info">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                />
              </svg>
              Browse Pets
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
