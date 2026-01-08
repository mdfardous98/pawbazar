import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const NotificationCenter = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, orders, listings

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Mock notifications for now - in real app, this would come from API
      const mockNotifications = [
        {
          id: 1,
          type: "order",
          title: "New Order Received",
          message: "Someone placed an order for your Golden Retriever listing",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          icon: "🛒",
          action: "/my-orders",
        },
        {
          id: 2,
          type: "listing",
          title: "Listing Approved",
          message: "Your Persian Cat listing has been approved and is now live",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          read: false,
          icon: "✅",
          action: "/my-listings",
        },
        {
          id: 3,
          type: "system",
          title: "Welcome to PawBazar!",
          message:
            "Thank you for joining our community. Start by adding your first listing.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: true,
          icon: "🎉",
          action: "/add-listing",
        },
        {
          id: 4,
          type: "order",
          title: "Order Status Update",
          message: "Your order for Premium Dog Food has been shipped",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          read: true,
          icon: "📦",
          action: "/my-orders",
        },
        {
          id: 5,
          type: "message",
          title: "New Message",
          message: "You have a new message about your Labrador listing",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
          icon: "💬",
          action: "/messages",
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "orders":
        return notifications.filter((n) => n.type === "order");
      case "listings":
        return notifications.filter((n) => n.type === "listing");
      default:
        return notifications;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-base-300">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Notifications</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle btn-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            {[
              { key: "all", label: "All", count: notifications.length },
              { key: "unread", label: "Unread", count: unreadCount },
              {
                key: "orders",
                label: "Orders",
                count: notifications.filter((n) => n.type === "order").length,
              },
              {
                key: "listings",
                label: "Listings",
                count: notifications.filter((n) => n.type === "listing").length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`btn btn-sm ${
                  filter === tab.key ? "btn-primary" : "btn-ghost"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="badge badge-sm ml-1">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="mt-3">
              <button onClick={markAllAsRead} className="btn btn-ghost btn-sm">
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-md"></span>
              <p className="mt-2 text-base-content/70">
                Loading notifications...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-base-content/70">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-base-200 transition-colors ${
                    !notification.read
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-medium text-sm ${
                            !notification.read ? "text-primary" : ""
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-base-content/60">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-base-content/70 mt-1">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        {notification.action && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              // In real app, navigate to the action URL
                              console.log("Navigate to:", notification.action);
                            }}
                            className="btn btn-xs btn-primary"
                          >
                            View
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="btn btn-xs btn-ghost"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="btn btn-xs btn-ghost text-error"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-base-300 text-center">
          <button onClick={onClose} className="btn btn-sm btn-outline w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
