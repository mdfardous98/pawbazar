import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();

      // Fetch user stats and analytics
      const [statsResponse, analyticsResponse] = await Promise.all([
        fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/stats/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
        fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/analytics/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      const statsData = await statsResponse.json();
      const analyticsData = await analyticsResponse.json();

      if (statsData.success) {
        setStats(statsData.data);
      }

      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/70 mt-2">
            Welcome back, {user.displayName || user.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-primary text-primary-content rounded-lg">
            <div className="stat-figure">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title text-primary-content/70">
              Total Listings
            </div>
            <div className="stat-value">{stats?.totalListings || 0}</div>
            <div className="stat-desc text-primary-content/70">
              Your active listings
            </div>
          </div>

          <div className="stat bg-secondary text-secondary-content rounded-lg">
            <div className="stat-figure">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div className="stat-title text-secondary-content/70">
              Total Orders
            </div>
            <div className="stat-value">{stats?.totalOrders || 0}</div>
            <div className="stat-desc text-secondary-content/70">
              Orders received
            </div>
          </div>

          <div className="stat bg-accent text-accent-content rounded-lg">
            <div className="stat-figure">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="stat-title text-accent-content/70">Revenue</div>
            <div className="stat-value">${stats?.totalRevenue || 0}</div>
            <div className="stat-desc text-accent-content/70">From sales</div>
          </div>

          <div className="stat bg-info text-info-content rounded-lg">
            <div className="stat-figure">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div className="stat-title text-info-content/70">Profile Views</div>
            <div className="stat-value">{stats?.profileViews || 0}</div>
            <div className="stat-desc text-info-content/70">This month</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
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
                <a href="/my-listings" className="btn btn-secondary">
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
                  My Listings
                </a>
                <a href="/my-orders" className="btn btn-accent">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  My Orders
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Browse
                </a>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Recent Activity</h2>
              <div className="space-y-3 mt-4">
                {analytics?.recentActivity?.length > 0 ? (
                  analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-base-content/60">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/60">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Listing Categories</h2>
              <div className="mt-4">
                {analytics?.categoryBreakdown?.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.categoryBreakdown.map((category, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-base-300 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${
                                  (category.count / stats?.totalListings) *
                                    100 || 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-base-content/60">
                            {category.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base-content/60">No data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Monthly Performance</h2>
              <div className="mt-4">
                {analytics?.monthlyStats?.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.monthlyStats.map((month, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium">
                          {month.month}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {month.listings} listings
                          </div>
                          <div className="text-xs text-base-content/60">
                            {month.orders} orders
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base-content/60">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
